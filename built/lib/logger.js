"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const colors = require("colors");
const debug = require("debug");
class Logger {
    constructor(options) {
        this.logLevel = 2;
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
    debug(...args) {
        if (this.logLevel <= 1) {
            this.doLog('[debug]', ...args);
        }
    }
    info(...args) {
        if (this.logLevel <= 2) {
            this.doLog('[info]', ...args);
        }
    }
    warn(...args) {
        if (this.logLevel <= 3) {
            this.doLog('[warn]', colors.yellow(args.join(' ')));
        }
    }
    error(...args) {
        if (this.logLevel <= 4) {
            this.doLog('[error]', colors.red(args.join(' ')));
        }
    }
    doLog(...args) {
        this.logger(args.join(' '));
    }
}
exports.Logger = Logger;
