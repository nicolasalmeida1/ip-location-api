import IpLocationService from '../services/location-by-ip.service';
import { NotFoundError } from '../errors/not-found.error';
import { errorMessage } from '../enums';

/**
 * Command to get location information based on an IP address.
 */
export default class GetLocationByIpCommand implements ICommand {
  /**
   * Creates an instance of GetLocationByIpCommand.
   * @param ipLocationService - Service responsible for finding location by IP.
   */
  constructor(private ipLocationService: IpLocationService) {
    this.ipLocationService = ipLocationService;
  }

  /**
   * Executes the command to retrieve location data for a given IP address.
   * @param {string} ip - The IP address to search for.
   * @returns {CommandOutput} An object containing country, countryCode, and city.
   * @throws NotFoundError if the IP address is not found.
   */
  execute(ip: string): CommandOutput {
    const location: IpRangeRecord | null = this.ipLocationService.findLocationByIp(ip);

    if (!location) {
      throw new NotFoundError(errorMessage.ipNotFound);
    }

    return {
      country: location.countryName,
      countryCode: location.countryCode,
      city: location.city,
    };
  }
}
