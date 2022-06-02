import * as path from 'path';
import * as process from 'process';
import { Exec } from './exec';
import { Logger } from './logger';

export class App {
  private readonly logger: Logger;
  private readonly exec: Exec;

  constructor() {
    this.logger = new Logger({ namespace: 'app' });
    this.exec = new Exec();
  }

  public async test(options: {
    helmBinary: string;
    watch: boolean;
    bail: boolean;
    parallel: boolean;
  }): Promise<void> {
    const execOptions = { output: true, cwd: process.cwd() };
    const mocha = path.join(__dirname, '../node_modules/.bin/mocha');
    const globals = path.join(__dirname, 'globals.js');
    if (options.helmBinary) {
      this.logger.info(`Using helm binary: ${options.helmBinary}`);
      process.env.HELM_BINARY = options.helmBinary;
    }
    let watch = '';
    if (options.watch) {
      this.logger.info('Watching for file changes enabled.');
      watch = ' --watch --watch-extensions yaml,tpl';
    }
    const extraFlags: string[] = [];
    if (options.bail) {
      extraFlags.push('--bail');
    }
    if (options.parallel) {
      extraFlags.push('--parallel');
    }

    const flags = extraFlags.length > 0 ? `${extraFlags.join(' ')} ` : '';
    const command = `${mocha}${watch} -r should -r ${globals} ${flags}--recursive tests`;
    await this.exec.command(command, execOptions);
  }
}
