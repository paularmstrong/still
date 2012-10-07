var child_process = require('child_process'),
  BIN = __dirname + '/../../bin/still';

describe('Options', function () {
  it('requires output directory', function (done) {
    child_process.exec(BIN, ['foo'], function (err, stdout, stderr) {
      var test = (/Missing required arguments\: o/).test(stderr),
        ok = test.should.be.ok;
      done();
    });
  });
});
