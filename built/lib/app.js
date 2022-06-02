"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path = require("path");
const process = require("process");
const exec_1 = require("./exec");
const logger_1 = require("./logger");
class App {
    constructor() {
        this.logger = new logger_1.Logger({ namespace: 'app' });
        this.exec = new exec_1.Exec();
    }
    async test(options) {
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
        const command = `${mocha}${watch} -r should -r ${globals} --recursive tests`;
        await this.exec.command(command, execOptions);
    }
}
exports.App = App;
