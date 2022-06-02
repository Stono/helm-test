"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helm = void 0;
const path = require("path");
const exec_1 = require("./exec");
const helm_1 = require("./resultsParsers/helm");
const kubeval_1 = require("./resultsParsers/kubeval");
class Helm {
    constructor() {
        this.helmBinary = process.env.HELM_BINARY
            ? process.env.HELM_BINARY
            : 'helm';
        this.command = `${this.helmBinary} template --namespace default release-name .`;
        this.files = [];
        this.sets = [];
        this.resultsParsers = [];
        this.exec = new exec_1.Exec();
        this.resultsParsers.push(new helm_1.HelmResultParser());
        if (process.env.HELM_TEST_KUBEVAL_ENABLED === 'true') {
            this.resultsParsers.push(new kubeval_1.KubeValResultsParser());
        }
    }
    withValueFile(valueFile) {
        const pathToValueFile = path.join(process.cwd(), valueFile);
        this.files.push(pathToValueFile);
        return this;
    }
    set(key, value) {
        this.sets.push(`${key}=${value}`);
        return this;
    }
    async go(done) {
        try {
            let command = this.command;
            if (this.files.length > 0) {
                command = `${command} -f ${this.files.join(' -f ')}`;
            }
            if (this.sets.length > 0) {
                command = `${command} --set ${this.sets.join(' --set ')}`;
            }
            this.files = [];
            this.sets = [];
            const result = await this.exec.command(command);
            for (const parser of this.resultsParsers) {
                await parser.parse(result);
            }
            if (done) {
                done();
            }
        }
        catch (ex) {
            if (done) {
                done(ex);
            }
        }
    }
}
exports.Helm = Helm;
