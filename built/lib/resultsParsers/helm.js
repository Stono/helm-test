"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelmResultParser = void 0;
const async = require("async");
const YAML = require("js-yaml");
const logger_1 = require("../logger");
class HelmResultParser {
    constructor() {
        this.logger = new logger_1.Logger({ namespace: 'helm-parser' });
        global.results = {
            byType: [],
            ofType: (type) => {
                if (Object.keys(global.results.byType).indexOf(type) > -1) {
                    return global.results.byType[type];
                }
                return [];
            },
            length: 0
        };
    }
    async parse(result) {
        global.results.byType = [];
        global.results.length = 0;
        const removeNonManifests = (manifest) => {
            return manifest.length > 0;
        };
        const manifests = result.stdout
            .split(/\r?\n---/)
            .filter(removeNonManifests);
        const parseToJson = (manifest, nextManifest) => {
            const sourceLine = manifest.split('\n').find((l) => {
                return l.startsWith('# Source');
            });
            let source;
            if (sourceLine) {
                source = sourceLine.replace('# Source: ', '');
            }
            let json;
            try {
                if (!manifest.includes('apiVersion')) {
                    nextManifest();
                    return;
                }
                json = YAML.load(manifest);
            }
            catch (ex) {
                this.logger.error(`Failed to parse manifest: ${source}`);
                this.logger.error(ex.message);
                nextManifest(new Error('Unable to parse manifest'));
                return;
            }
            if (!json || !json.kind) {
                nextManifest();
                return;
            }
            if (typeof global.results.byType[json.kind] === 'undefined') {
                global.results.byType[json.kind] = [];
            }
            global.results.length += 1;
            global.results.byType[json.kind].push(json);
            nextManifest();
        };
        await async.each(manifests, parseToJson);
    }
}
exports.HelmResultParser = HelmResultParser;
