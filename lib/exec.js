'use strict';
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const util = require('./util');
const logger = new require('./logger')({ namespace: 'exec' });
const commandExists = require('command-exists').sync;

require('colors');

const Exec = function(options) {
  options = util.defaultValue(options, {});
  const p = util.defaultValue(options.process, process);
  const self = {};

  const generateSpawnOptions = stdout => {
    let spawnOpts = {
      stdio: [
        p.stdin, p.stdout, p.stderr
      ]
    };

    if(!stdout) {
      spawnOpts.stdio = [
        p.stdin, 'pipe', 'pipe'
      ];
    }
    return spawnOpts;
  };

  const async = (root, args, options, done) => {
    let stdout = '';
    let stderr = '';

    const spawnOpts = generateSpawnOptions(options.output);

    if(options.cwd) {
      spawnOpts.cwd = options.cwd;
    }
    const proc = spawn(root, args, spawnOpts);

    if(!options.output) {
      proc.stdout.on('data', data => {
        if(options.output) { p.stdout.write(data.toString()); }
        stdout = stdout + data.toString();
      });
      proc.stderr.on('data', data => {
        if(options.output) { p.stderr.write(data.toString().red); }
        stderr = stderr + data.toString();
      });
    }

    proc.on('error', err => {
      done(err, {
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    proc.on('exit', code => {
      let err;
      if(code !== 0) {
        err = new Error('Process exited with non-zero status code: ' + code);
      }

      done(err, {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        code: code
      });
    });
  };

  const sync = (root, args, options) => {
    const proc = spawnSync(root, args, options);
    if(proc.error) {
      logger.log(` -> An error was raised while executing ${root} ${args}: "${proc.error}"`);
      return {stdout: '', stderr: proc.error};
    }
    return {
      stdout: proc.stdout.toString().trim(),
      stderr: proc.stderr.toString().trim()
    };
  };

  self.commandExists = commandExists;

  self.command = function(command, options, done) {
    options = util.defaultValue(options, {});
    options.output = util.defaultValue(options.output, false);
    const args = (command instanceof Array) ? command : command.split(' ');
    const root = args.shift();
    //logger.debug(' ->', root.cyan, args.join(' '));
    return async(root, args, options, done);
  };

  self.commandSync = function(command, options) {
    options = util.defaultValue(options, {});
    options.output = util.defaultValue(options.output, false);
    const args = (command instanceof Array) ? command : command.split(' ');
    const root = args.shift();
    //logger.debug(' ->', root.cyan, args.join(' '));
    return sync(root, args, options);
  };

  return Object.freeze(self);
};
module.exports = Exec;
