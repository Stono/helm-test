'use strict';
const Helm = require('../lib/helm');
const deride = require('deride');

describe('Helm', () => {

  describe('Helm 2', () => {
    let helm, exec;
    beforeEach(() => {
      exec = deride.stub(['command', 'commandSync']);
      exec.setup.command.toCallbackWith([null, { stdout: '' }]);
      exec.setup.commandSync.toReturn({ stdout: 'Client: v2.17.0+ga690bad'});
      helm = new Helm(exec);
    });
    it('should accept value files', () => {
      helm.withValueFile('some-file.yaml');
    });
    it('should run a helm template', done => {
      helm.go(done);
    });
  })

  describe('Helm 3', () => {
    let helm, exec;
    beforeEach(() => {
      exec = deride.stub(['command', 'commandSync']);
      exec.setup.command.toCallbackWith([null, { stdout: '' }]);
      exec.setup.commandSync.toReturn({ stdout: 'v3.6.3+gd506314'});
      helm = new Helm(exec);
    });
    it('should accept value files', () => {
      helm.withValueFile('some-file.yaml');
    });
    it('should run a helm template', done => {
      helm.go(done);
    });
  })
});
