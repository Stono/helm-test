"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubeValResultsParser = void 0;
const fs = require("fs");
const path = require("path");
const exec_1 = require("../exec");
const logger_1 = require("../logger");
class KubeValResultsParser {
    constructor() {
        this.tmpFile = '/tmp/helm-test-kubeval';
        this.kubevalBinary = 'kubeval';
        this.logger = new logger_1.Logger({ namespace: 'kubeval-parser' });
        const schemaLocation = process.env.KUBEVAL_SCHEMA_LOCATION;
        const kubeVersion = process.env.HELM_TEST_KUBEVAL_KUBERNETES_VERSION;
        if (typeof kubeVersion !== 'string') {
            throw new Error('Must specify HELM_TEST_KUBEVAL_KUBERNETES_VERSION');
        }
        this.kubeVersion = kubeVersion;
        if (typeof schemaLocation === 'string') {
            this.schemaLocation = schemaLocation;
            if (fs.existsSync(this.schemaLocation)) {
                const expectedVersionDir = `v${this.kubeVersion}-standalone-strict`;
                if (!fs.existsSync(path.join(this.schemaLocation, expectedVersionDir))) {
                    throw new Error(`${expectedVersionDir} was not found in your KUBEVAL_SCHEMA_LOCATION.  Make sure you've downloaded the right schema files`);
                }
            }
            else {
                throw new Error('The path specified in KUBEVAL_SCHEMA_LOCATION does not exist');
            }
        }
        else {
            this.logger.warn('KUBEVAL_SCHEMA_LOCATION not set in environment!  Performance will be poor');
        }
        const kubevalBinary = process.env.KUBEVAL_BINARY;
        if (typeof kubevalBinary === 'string') {
            this.kubevalBinary = kubevalBinary;
        }
        this.exec = new exec_1.Exec();
    }
    async parse(result) {
        fs.writeFileSync(this.tmpFile, result.stdout);
        let command = `${this.kubevalBinary} --ignore-missing-schemas --strict -o json --kubernetes-version=${this.kubeVersion} --quiet ${this.tmpFile}`;
        if (this.schemaLocation) {
            if (!fs.existsSync(this.schemaLocation)) {
                throw new Error(`Kubeval schema location does not exist: ${this.schemaLocation}`);
            }
            command = `${command} --schema-location=file://${this.schemaLocation}`;
        }
        const kubeval = await this.exec.command(command, { throw: false });
        const json = JSON.parse(kubeval.stdout);
        const invalid = json.filter((item) => item.status === 'invalid');
        if (invalid.length > 0) {
            this.logger.error('The following errors were found by kubeval:');
            invalid.forEach((error) => {
                this.logger.error(` - ${error.filename}:`);
                error.errors.forEach((individual) => {
                    this.logger.error(`     ${individual}`);
                });
            });
            throw new Error('Errors were detected by kubeval');
        }
    }
}
exports.KubeValResultsParser = KubeValResultsParser;
