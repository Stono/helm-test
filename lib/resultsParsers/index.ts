export interface IResultsParser {
  parse(result: { stdout: string }): Promise<void>;
}
