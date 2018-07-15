'use strict';
const path = require('path');
const process = require('process');
const async = require('async');
const HelmResultParser = function() {
  const logger = new require('./logger')('parser');
  const YAML = require('yamljs');

  let self = {};
  self.parse = function(done) {
    global.results = {
      byType: [],
      ofType: function(type) {
        if(Object.keys(this.byType).indexOf(type) > -1) {
          return this.byType[type];
        }
        return [];
      },
      length: 0
    };

    return function(err, result) {
      if(err) {
        logger.error('Helm failed to generate manifests');
        logger.error(err);
        return done(err);
      }
      const removeNonManifests = manifest => {
        return manifest.length > 0;
      };
      const manifests = result.stdout.split('---').filter(removeNonManifests);
      /* jshint maxcomplexity: 6 */
      const parseToJson = (manifest, nextManifest) => {
        const sourceLine = manifest.split('\n').find(l => { return l.startsWith('# Source'); });
        let source;
        if (sourceLine) {
          source = sourceLine.replace('# Source: ', '');
        }
        let json;
        try {
          json = YAML.parse(manifest);
        } catch(ex) {
          const err = new Error('Failed to parse manifest: ' + source);
          logger.error(err);
          logger.error(ex);
          return nextManifest(new Error('Unable to parse manifest'));
        }
        if(!json || !json.kind) { return nextManifest(); }
        if(global.results.byType[json.kind] === undefined) {
          global.results.byType[json.kind] = [];
        }
        global.results.length ++;
        global.results.byType[json.kind].push(json);
        nextManifest();
      };
      async.each(manifests, parseToJson, done);
    };
  };
  return Object.freeze(self);
};
const helmResultParser = new HelmResultParser();

module.exports = function Helm(exec, chartPath) {
  let self = {};
  let files = [];
  let sets = [];
  self.withValueFile = function(valueFile, chartName) {
    let pathToValueFile = path.join(process.cwd(), valueFile);
    if (!chartPath && chartName) {
      pathToValueFile = path.join(process.cwd(), chartName, valueFile);
    }

    files.push(pathToValueFile);
    return self;
  };
  self.set = function(key, value) {
    sets.push(key + '=' + value);
    return self;
  };
  self.go = function(done, chartName) {
    chartName = chartPath || chartName || '.';
    let command = `helm template ${chartName}`;
    if(files.length > 0) {
      command = command + ' -f ' + files.join(' -f ');
    }
    if(sets.length > 0) {
      command = command + ' --set ' + sets.join(' --set ');
    }

    files = [];
    sets = [];
    const options = { output: false };
    exec.command(command, options, helmResultParser.parse(done));
    return self;
  };
  self.lint = function(done, chartName) {
    chartName = chartPath || chartName || '.';
    let command = `helm lint ${chartName}`;

    const options = { output: true };
    exec.command(command, options, helmResultParser.parse(done));
    return self;
  }
  return Object.freeze(self);
};
