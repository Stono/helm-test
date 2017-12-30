'use strict';
const Logger = require('../lib/logger');
const deride = require('deride');
require('colors');

describe('Logger', () => {
  let logger, mockConsole, debug;
  beforeEach(() => {
    mockConsole = deride.stub(['log', 'error']);
    debug = deride.func();
    logger = new Logger({
      debug: debug
    });
  });
  it('should init with default values', () => {
    let l = new Logger();
    l = undefined;
  });
  it('should write log messages', () => {
    logger.log('testing');
    debug.expect.called.withArg('[info]');
    debug.expect.called.withArg('testing');
  });
  it('should write error messages', () => {
    logger.error('testing');
    debug.expect.called.withArg('[error]');
    debug.expect.called.withArg('testing'.red);
  });
});
