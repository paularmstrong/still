var _ = require('lodash'),
  fs = require('fs'),
  consolidate = require('consolidate'),
  utils = require('./utils'),
  _engine,
  _out,
  _in,
  _encoding;

exports.setEngine = function (engine, path) {
  var swig;

  if (!consolidate[engine]) {
    utils.error('Template engine', engine, 'does not exist');
    process.exit(1);
  }

  _engine = engine;

  if (_engine === 'swig') {
    // Swig requires some extra setup
    swig = require('swig');
    swig.init({
      root: path,
      allowErrors: false
    });
  }
};

exports.setOutput = function (input, out) {
  _in = new RegExp('^' + input);
  _out = process.cwd() + '/' + out;
};

exports.setEncoding = function (encoding) {
  _encoding = encoding;
};

function _getOutputFile(file) {
  return file.replace(_in, _out).replace(/\/{2,}/g, '/');
}

function _getOutputPath(file) {
  return _getOutputFile(file).replace(/\/[^\/]*$/, '');
}


exports.build = function (file, stat) {
  var dataFile = file.replace(/html$/, 'json'),
    dirname = _getOutputPath(file),
    outFile = _getOutputFile(file);

  fs.readFile(dataFile, _encoding, function (err, jsonData) {
    var data = {};

    if (err) {
      utils.warn('No data for file', file);
    }

    try {
      data = _.extend(stat, JSON.parse(jsonData));
    } catch (e) {
      utils.log('No data found', dataFile);
    }

    consolidate[_engine](file, data, function (err, html) {
      if (err || html.render) {
        utils.error('Unable to render file', file);
        throw err;
      }

      fs.mkdir(dirname, function (err) {
        if (err && err.errno !== 47) {
          utils.error('Cannot make directory', dirname);
          process.exit(1);
        }

        fs.writeFile(outFile, html, _encoding, function (err) {
          if (err) {
            utils.error('Cannot write file', outFile);
            return;
          }

          utils.out('[Built]', outFile);
        });
      });
    });
  });
};
