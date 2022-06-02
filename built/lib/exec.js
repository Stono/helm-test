"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exec = void 0;
const ChildProcess = require("child_process");
const logger_1 = require("./logger");
const spawn = ChildProcess.spawn;
const generateSpawnOptions = (stdout) => {
    const spawnOpts = {
        stdio: [
            process.stdin,
            process.stdout,
            process.stderr
        ]
    };
    if (!stdout) {
        spawnOpts.stdio = [process.stdin, 'pipe', 'pipe'];
    }
    return spawnOpts;
};
class Exec {
    constructor(proc) {
        this.logger = new logger_1.Logger({ namespace: 'exec' });
        this.process = proc || process;
    }
    command(command, options) {
        this.logger.debug(Array.isArray(command) ? command.join(' ') : command);
        const args = command instanceof Array ? command : command.split(' ');
        const root = args.shift();
        return this.async(root, args, options);
    }
    async(root, args, options) {
        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            const spawnOpts = generateSpawnOptions(options?.output ?? false);
            if (options?.cwd) {
                spawnOpts.cwd = options.cwd;
            }
            const proc = spawn(root, args, spawnOpts);
            if (!options?.output) {
                proc.stdout.on('data', (data) => {
                    stdout += data.toString();
                });
                proc.stderr.on('data', (data) => {
                    stderr += data.toString();
                });
            }
            proc.on('error', (err) => {
                reject(err);
            });
            proc.on('exit', (code) => {
                let err = null;
                if (code === null || typeof code === 'undefined') {
                    err = new Error('No exit code returned from exec');
                }
                else if (code !== 0) {
                    err = new Error(stderr.trim());
                }
                const shouldThrow = options?.throw ?? true;
                if (err && shouldThrow) {
                    return reject(err);
                }
                return resolve({
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    code: code
                });
            });
        });
    }
}
exports.Exec = Exec;
