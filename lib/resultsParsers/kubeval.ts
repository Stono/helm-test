import * as fs from 'fs';
import * as path from 'path';
import { type IResultsParser } from '.';
import { Exec } from '../exec';
import { Logger } from '../logger';
import { TmpFileWriter } from './tmpFileWriter';

export class KubeValResultsParser implements IResultsParser {
  public static readonly ENABLED =
    process.env.HELM_TEST_KUBEVAL_ENABLED === 'true';
  private logger: Logger;
  private readonly kubeVersion: string;
  private readonly kubevalBinary: string = 'kubeval';
  private readonly exec: Exec;
  private readonly schemaLocation: string | undefined;

  constructor() {
    this.logger = new Logger({ namespace: 'kubeval-parser' });
    const schemaLocation = process.env.KUBEVAL_SCHEMA_LOCATION;
    const kubeVersion = process.env.HELM_TEST_KUBEVAL_KUBERNETES_VERSION;
    if (typeof kubeVersion !== 'string') {
      throw new Error('Must specify HELM_TEST_KUBEVAL_KUBERNETES_VERSION');
    }
    this.kubeVersion = kubeVersion;

    if (typeof schemaLocation === 'string') {
      this.schemaLocation = schemaLocation;
      if (fs.existsSync(this.schemaLocation)) {
        const expectedVersionDir = `v${this.kubeVersion}-standalone-strict`;
        if (
          !fs.existsSync(path.join(this.schemaLocation, expectedVersionDir))
        ) {
          throw new Error(
            `${expectedVersionDir} was not found in your KUBEVAL_SCHEMA_LOCATION.  Make sure you've downloaded the right schema files`
          );
        }
      } else {
        throw new Error(
          'The path specified in KUBEVAL_SCHEMA_LOCATION does not exist'
        );
      }
    } else {
      this.logger.warn(
        'KUBEVAL_SCHEMA_LOCATION not set in environment!  Performance will be poor'
      );
    }

    const kubevalBinary = process.env.KUBEVAL_BINARY;
    if (typeof kubevalBinary === 'string') {
      this.kubevalBinary = kubevalBinary;
    }

    this.exec = new Exec();
  }

  public async parse(): Promise<void> {
    let command = `${this.kubevalBinary} --ignore-missing-schemas --strict -o json --kubernetes-version=${this.kubeVersion} --quiet ${TmpFileWriter.LOCATION}`;
    if (this.schemaLocation) {
      if (!fs.existsSync(this.schemaLocation)) {
        throw new Error(
          `Kubeval schema location does not exist: ${this.schemaLocation}`
        );
      }
      command = `${command} --schema-location=file://${this.schemaLocation}`;
    }
    const kubeval = await this.exec.command(command, { throw: false });
    const json = JSON.parse(kubeval.stdout);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invalid = json.filter((item: any) => item.status === 'invalid');
    if (invalid.length > 0) {
      this.logger.error('The following errors were found by kubeval:');
      invalid.forEach((error: { filename: string; errors: string[] }) => {
        this.logger.error(` - ${error.filename}:`);
        error.errors.forEach((individual) => {
          this.logger.error(`     ${individual}`);
        });
      });
      throw new Error('Errors were detected by kubeval');
    }
  }
}
