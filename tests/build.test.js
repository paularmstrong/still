var _ = require('lodash'),
  testutils = require('./testutils'),
  fs = require('fs'),
  still = require('../').build.build,
  path = __dirname + '/templates/swig',
  out = 'tests/tmp',
  index = __dirname + '/tmp/index.html',
  options = {
    _: [path],
    o: out,
    e: 'swig',
    encoding: 'utf-8',
    verbose: 0
  };

describe('Options', function () {

  afterEach(testutils.teardown);

  describe('o, out', function () {
    it('Can output to a local path', function (done) {
      still(options, function () {
        fs.exists(index, function (exists) {
          exists.should.eql(true);
          done();
        });
      });
    });

    it('Can output to an absolute path', function (done) {
      still(_.extend(options, { o: __dirname + '/tmp' }), function () {
        fs.exists(index, function (exists) {
          exists.should.eql(true);
          done();
        });
      });
    });
  });

  describe('e, engine', function () {
    it('Defaults to `swig`');
  });

  describe('i, ignore', function () {

    it('ignores with a single string', function (done) {
      still(_.extend({ 'i': 'index' }, options), function () {
        fs.exists(index, function (exists) {
          exists.should.eql(false);
          done();
        });
      });
    });

    it('ignores multiple if declared', function (done) {
      still(_.extend({ 'i': ['index', 'layout'] }, options), function () {
        fs.exists(index, function (exists) {
          exists.should.eql(false);
          fs.exists(__dirname + '/tmp/layout/index.html', function (exists) {
            exists.should.eql(false);
            done();
          });
        });
      });
    });

    it('accepts regular expressions', function (done) {
      still(_.extend({ 'i': '/in[dex]{3}\\.html$/' }, options), function () {
        fs.exists(index, function (exists) {
          exists.should.eql(false);
          done();
        });
      });
    });
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

  afterEach(testutils.teardown);

  it('are copied from input directory to output', function (done) {
    still(options, function (err) {
      fs.exists(__dirname + '/tmp/foo.txt', function (exists) {
        exists.should.eql(true);
        done();
      });
    });
  });
});
