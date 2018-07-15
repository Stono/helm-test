'use strict';
const exec = new require('./exec')();
const Helm = require('./helm');
global.helm = new Helm(exec);
global.yaml = require('yamljs');
