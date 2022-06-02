import * as yaml from 'js-yaml';
import { Helm } from './helm';
declare var global: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yaml: any;
  helm: Helm;
};

global.helm = new Helm();
global.yaml = yaml;
global.yaml.parse = global.yaml.load;
global.yaml.safeLoad = global.yaml.load;
