'use strict';
const App = require('../lib/app');
const deride = require('deride');

describe('App', () => {
  let app, exec;
  beforeEach(done => {
    exec = deride.stub(['command']);
    exec.setup.command.toCallbackWith(null);
    app = new App(exec);
    app.test({}, done);
  });

  it('should execute mocha', () => {
    exec.expect.command.called.once();
  });
});
