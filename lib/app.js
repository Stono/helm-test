'use strict';
const logger = new require('./logger')();
const path = require('path');
const process = require('process');

module.exports = function App(exec) {
  let self = {};
  self.test = function(options, done) {
    const execOptions = { output: true, cwd: process.cwd() };
    const mocha = path.join(__dirname, '../node_modules/mocha/bin/mocha');
    let globals = path.join(__dirname, 'globals.js');
    let pattern = 'tests'
    if(options.all) {
      globals = path.join(__dirname, 'all-globals.js');
      pattern = './**/tests/**/*.js';
    }
    let watch = '';
    if(options.watch) {
      logger.log('Watching for file changes enabled.');
      watch = ' --watch --watch-extensions yaml,tpl';
    }
    const command = `${mocha}${watch} -r should -r ${globals} --recursive ${pattern}`;
    logger.log('Testing...');
    exec.command(command, execOptions, done);
  };
  return Object.freeze(self);
};
