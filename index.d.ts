type IpRangeRecord = {
  lower: number;
  upper: number;
  countryCode: string;
  countryName: string;
  region: string;
  city: string;
};

type CommandOutput = {
  country: string;
  countryCode: string;
  city: string;
};

interface ICommand {
  execute(input: string): CommandOutput;
}
