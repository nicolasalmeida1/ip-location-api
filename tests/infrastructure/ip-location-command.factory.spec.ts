import IpLocationCommandFactory from '../../src/infrastructure/factories/ip-location-command.factory';
import GetLocationByIpCommand from '../../src/domain/commands/location-by-ip.command';
import IpLocationService from '../../src/domain/services/location-by-ip.service';
import { errorMessage } from '../../src/domain/enums';

describe('IpLocationCommandFactory', () => {
  beforeEach(() => {
    // @ts-ignore
    IpLocationCommandFactory['ipLocationService'] = undefined;
  });

  it('should throw an error if service was not initialized', () => {
    expect(() => IpLocationCommandFactory.create()).toThrow(errorMessage.ipServiceNotInitialized);
  });

  it('should create a GetLocationByIpCommand when service is initialized', () => {
    const mockService = {} as IpLocationService;

    IpLocationCommandFactory.init(mockService);
    const command = IpLocationCommandFactory.create();

    expect(command).toBeInstanceOf(GetLocationByIpCommand);
    // @ts-ignore
    expect(command.ipLocationService).toBe(mockService);
  });
});
