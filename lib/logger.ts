import * as colors from 'colors';
import * as debug from 'debug';

export class Logger {
  private readonly logger: debug.Debugger;
  private readonly logLevel: number = 2;
  constructor(options: { namespace: string }) {
    const namespace = options.namespace
      ? `helm-test:${options.namespace}`
      : 'helm-test';
    this.logger = debug(namespace);
    debug.enable('helm-test,helm-test:*');
    if (typeof process.env.LOG_LEVEL === 'string') {
      this.logLevel =
        { debug: 1, info: 2, warn: 3, error: 4 }[process.env.LOG_LEVEL] ?? 2;
    }
  }
  public debug(...args: string[]): void {
    if (this.logLevel <= 1) {
      this.doLog('[debug]', ...args);
    }
  }
  public info(...args: string[]): void {
    if (this.logLevel <= 2) {
      this.doLog('[info]', ...args);
    }
  }
  public warn(...args: string[]): void {
    if (this.logLevel <= 3) {
      this.doLog('[warn]', colors.yellow(args.join(' ')));
    }
  }
  public error(...args: string[]): void {
    if (this.logLevel <= 4) {
      this.doLog('[error]', colors.red(args.join(' ')));
    }
  }
  private doLog(...args: string[]): void {
    this.logger(args.join(' '));
  }
}
