import fs from 'fs';
import IpLocationService from '../../../src/domain/services/location-by-ip.service';
import { errorMessage } from '../../../src/domain/enums';

class TestableIpLocationService extends IpLocationService {
  public getRecords() {
    return this['records'];
  }

  public getLoaded() {
    return this['isLoaded'];
  }

  public setRecords(records: IpRangeRecord[]) {
    this['records'] = records;
  }

  public setLoaded(loaded: boolean) {
    this['isLoaded'] = loaded;
  }
}

describe('IpLocationService', () => {
  let service: TestableIpLocationService;

  beforeEach(() => {
    service = new TestableIpLocationService();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    service.setRecords([
      {
        lower: 16777472,
        upper: 16778239,
        countryCode: 'CN',
        countryName: 'China',
        region: 'Fujian',
        city: 'Fuzhou',
      },
      {
        lower: 16778240,
        upper: 16779263,
        countryCode: 'AU',
        countryName: 'Australia',
        region: 'Victoria',
        city: 'Melbourne',
      },
    ]);
    service.setLoaded(true);
  });

  it('should throw an error if data is not loaded', () => {
    const freshService = new TestableIpLocationService();
    expect(() => freshService.findLocationByIp('1.0.1.1')).toThrow(errorMessage.serviceNotReady);
  });

  it('should return null when IP does not match any record', () => {
    const result = service.findLocationByIp('8.8.8.8');
    expect(result).toBeNull();
  });

  it('should return matching record when IP is found in range', () => {
    const result = service.findLocationByIp('1.0.1.1');
    expect(result).toEqual({
      lower: 16777472,
      upper: 16778239,
      countryCode: 'CN',
      countryName: 'China',
      region: 'Fujian',
      city: 'Fuzhou',
    });
  });

  it('should return second record if IP falls in second range', () => {
    const result = service.findLocationByIp('1.0.7.255');
    expect(result).toEqual({
      lower: 16778240,
      upper: 16779263,
      countryCode: 'AU',
      countryName: 'Australia',
      region: 'Victoria',
      city: 'Melbourne',
    });
  });

  it('should go left in binary search when ipId is less than record.lower', () => {
    const fresh = new TestableIpLocationService();
    fresh.setRecords([
      {
        lower: 200,
        upper: 300,
        countryCode: 'US',
        countryName: 'United States',
        region: 'Test Region',
        city: 'Test City',
      },
    ]);
    fresh.setLoaded(true);

    const result = fresh.findLocationByIp('0.0.0.1');
    expect(result).toBeNull();
  });

  it('should not reload data if already loaded', async () => {
    const fresh = new TestableIpLocationService();
    fresh.setLoaded(true);

    const mockLine = `"16777472","16778239","CN","China","Fujian","Fuzhou"`;
    jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValueOnce(require('stream').Readable.from([mockLine]));

    await fresh.loadData();
    await fresh.loadData();

    expect(fresh.getLoaded()).toBe(true);
  });

  it('should log record count after loading data', async () => {
    const fresh = new TestableIpLocationService();

    const mockLine = `"16777472","16778239","CN","China","Fujian","Fuzhou"`;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValueOnce(require('stream').Readable.from([mockLine]));

    await fresh.loadData();

    expect(consoleSpy).toHaveBeenCalledWith('IP data loaded: 1 records');

    consoleSpy.mockRestore();
  });
});
