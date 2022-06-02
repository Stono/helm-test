"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("js-yaml");
const helm_1 = require("./helm");
global.helm = new helm_1.Helm();
global.yaml = yaml;
global.yaml.parse = global.yaml.load;
global.yaml.safeLoad = global.yaml.load;
