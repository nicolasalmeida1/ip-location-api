import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { errorMessage } from '../enums';

/**
 * Service responsible for loading IP range data and finding location information by IP address.
 */
export default class IpLocationService {
  private records: IpRangeRecord[] = [];
  private isLoaded = false;

  /**
   * Loads IP range data from a CSV file into memory.
   * Ensures data is loaded only once.
   * @returns {void} Promise<void>
   */
  public async loadData(): Promise<void> {
    if (this.isLoaded) return;

    const filePath = path.join(__dirname, '..', '..', '..', 'ip-location.CSV');
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
      const [lower, upper, countryCode, countryName, region, city] = line
        .replace(/"/g, '')
        .split(',');

      this.records.push({
        lower: Number(lower),
        upper: Number(upper),
        countryCode,
        countryName,
        region,
        city,
      });
    }

    this.records.sort((a, b) => a.lower - b.lower);
    this.isLoaded = true;

    console.log(`IP data loaded: ${this.records.length} records`);
  }

  /**
   * Finds the location record for a given IP address.
   * @param {string} ip - The IP address to search for.
   * @returns {IpRangeRecord} The matching IpRangeRecord or null if not found.
   * @throws Error if the service data is not loaded.
   */
  public findLocationByIp(ip: string): IpRangeRecord | null {
    if (!this.isLoaded) {
      throw new Error(errorMessage.serviceNotReady);
    }

    const ipId = this.ipToId(ip);
    let left = 0;
    let right = this.records.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const record = this.records[mid];

      if (ipId < record.lower) {
        right = mid - 1;
      } else if (ipId > record.upper) {
        left = mid + 1;
      } else {
        return record;
      }
    }

    return null;
  }

  /**
   * Converts an IPv4 address string to a numeric ID.
   * @param {string} ip - The IPv4 address in dotted-decimal notation.
   * @returns {number} The numeric representation of the IP address.
   */
  private ipToId(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
  }
}
