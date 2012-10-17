var fs = require('fs'),
  still = require('../');

describe('Templates', function () {

  describe('Swig', function () {
    var out = 'tests/tmp/swigout';

    it('renders', function (done) {
      still.run({
        _: [__dirname + '/templates/swig'],
        e: 'swig',
        o: out,
        v: -1,
        encoding: 'utf-8'
      }, function () {
        fs.readFile(out + '/index.html', 'utf8', function (err, data) {
          data.should.eql('\nhi\n');
          done();
        });
      });
    });
  });

});
