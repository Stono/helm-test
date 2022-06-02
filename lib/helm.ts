import * as path from 'path';
import { Exec } from './exec';
import { Logger } from './logger';
import { type IResultsParser } from './resultsParsers';
import { HelmResultParser } from './resultsParsers/helm';
import { IstioCtlResultsParser } from './resultsParsers/istioctl';
import { KubeValResultsParser } from './resultsParsers/kubeval';
import { TmpFileWriter } from './resultsParsers/tmpFileWriter';

export class Helm {
  private readonly helmBinary = process.env.HELM_BINARY
    ? process.env.HELM_BINARY
    : 'helm';
  private readonly command = `${this.helmBinary} template --namespace default release-name .`;
  private files: string[] = [];
  private sets: string[] = [];
  private readonly exec: Exec;

  private readonly logger: Logger;
  private readonly sequentialResultsParsers: IResultsParser[] = [];
  private readonly parallelResultsParsers: IResultsParser[] = [];

  constructor() {
    this.exec = new Exec();
    this.logger = new Logger({ namespace: 'helm' });
    this.sequentialResultsParsers.push(new HelmResultParser());

    if (KubeValResultsParser.ENABLED || IstioCtlResultsParser.ENABLED) {
      this.sequentialResultsParsers.push(new TmpFileWriter());
    }

    if (KubeValResultsParser.ENABLED) {
      this.parallelResultsParsers.push(new KubeValResultsParser());
    }

    if (IstioCtlResultsParser.ENABLED) {
      this.parallelResultsParsers.push(new IstioCtlResultsParser());
    }
  }

  public withValueFile(valueFile: string): Helm {
    const pathToValueFile = path.join(process.cwd(), valueFile);
    this.files.push(pathToValueFile);
    return this;
  }

  public set(key: string, value: string): Helm {
    this.sets.push(`${key}=${value}`);
    return this;
  }

  public async go(done?: (err?: Error) => void): Promise<void> {
    try {
      let command = this.command;
      if (this.files.length > 0) {
        command = `${command} -f ${this.files.join(' -f ')}`;
      }
      if (this.sets.length > 0) {
        command = `${command} --set ${this.sets.join(' --set ')}`;
      }

      this.files = [];
      this.sets = [];

      const result = await this.exec.command(command, { throw: true });
      for (const parser of this.sequentialResultsParsers) {
        this.logger.debug(`running results parser: ${parser.constructor.name}`);
        await parser.parse(result);
      }
      await Promise.all(
        this.parallelResultsParsers.map(async (parser) => {
          this.logger.debug(
            `running results parser: ${parser.constructor.name}`
          );
          await parser.parse(result);
        })
      );
      if (done) {
        done();
      }
    } catch (ex) {
      this.logger.error(ex.message);
      if (done) {
        done(ex);
      }
    }
  }
}
