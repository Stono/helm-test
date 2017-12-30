'use strict';
const path = require('path');
const process = require('process');
const async = require('async');

const HelmResultParser = function() {
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
      if(err) { return done(err); }
      const manifests = result.stdout.split('---');
      const parseToJson = (manifest, nextManifest) => {
        const json = YAML.parse(manifest);
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

module.exports = function Helm(exec) {
  let self = {};
  const files = [];
  self.withValueFile = function(valueFile) {
    const pathToValueFile = path.join(process.cwd(), valueFile);
    files.push(pathToValueFile);
    return self;
  };
  self.go = function(done) {
    let command = 'helm template .';
    if(files.length > 0) {
      command = command + ' -f ' + files.join(' -f ');
    }
    const options = { output: false };
    exec.command(command, options, helmResultParser.parse(done));
  };
  return Object.freeze(self);
};
