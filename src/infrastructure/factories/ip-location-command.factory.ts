import IpLocationService from '../../domain/services/location-by-ip.service';
import GetLocationByIpCommand from '../../domain/commands/location-by-ip.command';
import { errorMessage } from '../../domain/enums';

/**
 * Factory for creating GetLocationByIpCommand instances.
 * Ensures the IpLocationService is initialized before creating commands.
 */
export default class IpLocationCommandFactory {
  private static ipLocationService: IpLocationService;

  /**
   * Initializes the factory with an IpLocationService instance.
   * @param {IpLocationService} service - The IpLocationService to be used by the factory.
   */
  static init(service: IpLocationService) {
    this.ipLocationService = service;
  }

  /**
   * Creates a new GetLocationByIpCommand using the initialized IpLocationService.
   * @returns {GetLocationByIpCommand} A new instance of GetLocationByIpCommand.
   * @throws Error if the IpLocationService has not been initialized.
   */
  static create(): GetLocationByIpCommand {
    if (!this.ipLocationService) {
      throw new Error(errorMessage.ipServiceNotInitialized);
    }

    return new GetLocationByIpCommand(this.ipLocationService);
  }
}
