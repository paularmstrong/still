var _ = require('lodash'),
  fs = require('fs'),
  still = require('../').build.build,
  path = __dirname + '/templates/swig',
  out = 'tests/tmp/out',
  options = {
    _: [path],
    o: out,
    e: 'swig',
    encoding: 'utf-8',
    verbose: 0
  };

describe('Options', function () {

  describe('o, out', function () {
    it('Can output to a local path', function (done) {
      still(options, function () {
        fs.exists(__dirname + '/tmp/out/index.html', function (exists) {
          exists.should.eql(true);
          done();
        });
      });
    });

    it('Can output to an absolute path', function (done) {
      still(_.defaults({ o: __dirname + '/tmp/abs'}, options), function () {
        fs.exists(__dirname + '/tmp/abs/index.html', function (exists) {
          exists.should.eql(true);
          done();
        });
      });
    });
  });

  describe('e, engine', function () {
    it('Defaults to `swig`');
    it('Can be `jade`');
    it('Can be `ejs`');
  });

  describe('i, ignore', function () {
    it('ignores with a single string');
    it('ignores multiple if declared');
    it('accepts regular expressions');
  });

  describe('encoding', function () {
    it('Defaults to utf-8');
  });

  describe('v, verbose', function () {
    it('defaults to 0');

    describe('0', function () {
      it('is silent');
    });
    describe('1', function () {
      it('only logs errors and build information');
    });
    describe('2', function () {
      it('logs warnings');
    });
    describe('3', function () {
      it('logs everything');
    });
  });

});

describe('Static Files', function () {
  it('are copied from input directory to output');
});
