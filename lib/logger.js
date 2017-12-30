'use strict';
const util = require('./util');
const colors = require('colors');
module.exports = function Logger(options) {
  options = util.defaultValue(options, {});
  const namespace = options.namespace ? `helm-test:${options.namespace}` : 'helm-test';
  const debug = util.defaultValue(options.debug, () => { return require('debug')(namespace); });
  const self = {};
  self.log = function(...args) {
    self.debug('[info]', ...args);
  };
  self.warn = function(...args) {
    self.debug('[warn]', colors.yellow(...args));
  };
  self.error = function(...args) {
    self.debug('[error]', colors.red(...args));
  };
  self.debug = function(...args) {
    debug(...args);
  };
  self.log = self.log;
  return Object.freeze(self);
};
