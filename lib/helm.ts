import * as path from 'path';
import { Exec } from './exec';
import { type IResultsParser } from './resultsParsers';
import { HelmResultParser } from './resultsParsers/helm';
import { KubeValResultsParser } from './resultsParsers/kubeval';

export class Helm {
  private readonly helmBinary = process.env.HELM_BINARY
    ? process.env.HELM_BINARY
    : 'helm';
  private readonly command = `${this.helmBinary} template --namespace default release-name .`;
  private files: string[] = [];
  private sets: string[] = [];
  private readonly exec: Exec;

  private readonly resultsParsers: IResultsParser[] = [];

  constructor() {
    this.exec = new Exec();
    this.resultsParsers.push(new HelmResultParser());
    if (process.env.HELM_TEST_KUBEVAL_ENABLED === 'true') {
      this.resultsParsers.push(new KubeValResultsParser());
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

      const result = await this.exec.command(command);
      for (const parser of this.resultsParsers) {
        await parser.parse(result);
      }
      if (done) {
        done();
      }
    } catch (ex) {
      if (done) {
        done(ex);
      }
    }
  }
}
