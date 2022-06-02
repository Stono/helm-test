import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { type IResultsParser } from '.';
import { Logger } from '../logger';

export class TmpFileWriter implements IResultsParser {
  public static readonly LOCATION: string = path.join(
    os.tmpdir(),
    'helm-test-manifests'
  );
  private logger: Logger;
  constructor() {
    this.logger = new Logger({ namespace: 'tmp-file' });
  }

  public async parse(result: { stdout: string }): Promise<void> {
    this.logger.debug(
      `writing manifests to temp file: ${TmpFileWriter.LOCATION}`
    );
    fs.writeFileSync(TmpFileWriter.LOCATION, result.stdout);
  }
}
