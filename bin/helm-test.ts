#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { App } from '../lib/app';
import { Logger } from '../lib/logger';
import { IstioCtlResultsParser } from '../lib/resultsParsers/istioctl';
import { KubeValResultsParser } from '../lib/resultsParsers/kubeval';

const version = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json')).toString()
).version;
const logger = new Logger({ namespace: 'helm-test' });
const app = new App();
const program = new Command();

logger.info(`Welcome to helm-test v${version}!`);
const kubevalEnabled = KubeValResultsParser.ENABLED;
const kubevalVersion = process.env.HELM_TEST_KUBEVAL_KUBERNETES_VERSION;
const kubevalSchemaLocation = process.env.KUBEVAL_SCHEMA_LOCATION;
logger.info(
  `kubeval enabled: ${kubevalEnabled}, kubevalVersion: ${kubevalVersion}, kubevalSchemaLocation: ${kubevalSchemaLocation}`
);

const istioctlEnabled = IstioCtlResultsParser.ENABLED;
logger.info(`istioctl enabled: ${istioctlEnabled}`);

program
  .version(version)
  .option('-w, --watch', 'Watch for file changes and re-run tests')
  .option('-h, --helm-binary <location>', 'location of the helm binary')
  .parse(process.argv);

logger.info('running tests...');
app
  .test(program.opts())
  .then(() => {
    return logger.info('helm-test completed successfully');
  })
  .catch((err) => {
    logger.error('helm-test failed to complete');
    console.error(err.message);
    process.exit(1);
  });
