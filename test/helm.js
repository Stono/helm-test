'use strict';
const Helm = require('../lib/helm');
const deride = require('deride');

describe('Helm', () => {
  let helm, exec;
  beforeEach(() => {
    exec = deride.stub(['command']);
    exec.setup.command.toCallbackWith([null, { stdout: '' }]);
    helm = new Helm(exec);
  });
  it('should support versions 2 and 3', () => {
    helm.version("2");
    helm.version("3");
    (function() { helm.version("1") }.should.throw());
  });
  it('should accept value files', () => {
    helm.withValueFile('some-file.yaml');
  });
  it('should run a helm template', done => {
    helm.go(done);
  });
});
