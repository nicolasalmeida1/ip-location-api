import GetLocationByIpCommand from '../../../src/domain/commands/location-by-ip.command';
import { NotFoundError } from '../../../src/domain/errors/not-found.error';
import { errorMessage } from '../../../src/domain/enums';
import IpLocationService from '../../../src/domain/services/location-by-ip.service';

const mockLocation: IpRangeRecord = {
  lower: 16777472,
  upper: 16778239,
  countryCode: 'CN',
  countryName: 'China',
  region: 'Fujian',
  city: 'Fuzhou',
};

describe('GetLocationByIpCommand', () => {
  let ipLocationService: jest.Mocked<IpLocationService>;

  beforeEach(() => {
    ipLocationService = {
      findLocationByIp: jest.fn(),
    } as unknown as jest.Mocked<IpLocationService>;
  });

  it('should return country information when IP is found', () => {
    ipLocationService.findLocationByIp.mockReturnValue(mockLocation);

    const command = new GetLocationByIpCommand(ipLocationService);
    const result = command.execute('1.0.1.1');

    expect(result).toEqual({
      country: 'China',
      countryCode: 'CN',
      city: 'Fuzhou',
    });
    expect(ipLocationService.findLocationByIp).toHaveBeenCalledWith('1.0.1.1');
  });

  it('should throw NotFoundError when IP is not found', () => {
    ipLocationService.findLocationByIp.mockReturnValue(null);

    const command = new GetLocationByIpCommand(ipLocationService);

    expect(() => command.execute('0.0.0.0')).toThrow(NotFoundError);
    expect(() => command.execute('0.0.0.0')).toThrow(errorMessage.ipNotFound);
  });
});
