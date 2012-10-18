var _ = require('lodash'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  consolidate = require('consolidate'),
  utils = require('./utils'),
  findit = require('findit');

var _engine,
  _out,
  _in,
  _encoding,
  files = 0,
  argv,
  finder,
  path,
  __swig;

function _getOutputFile(file) {
  return file.replace(_in, _out).replace(/\/{2,}/g, '/');
}

function _getOutputPath(file) {
  return _getOutputFile(file).replace(/\/[^\/]*$/, '');
}


function _build(file, stat, cb) {
  var dataFile = file.replace(/html$/, 'json'),
    dirname = _getOutputPath(file),
    outFile = _getOutputFile(file);

  fs.readFile(dataFile, _encoding, function (err, jsonData) {
    var data = stat;

    if (err) {
      utils.warn('No data for file', file);
    } else {
      try {
        data = _.extend(data, JSON.parse(jsonData));
      } catch (e) {
        utils.warn('Data not proper JSON', dataFile);
      }
    }

    consolidate[_engine](file, data, function (err, html) {
      if (err || html.render) {
        utils.error('Unable to render file', file);
        throw err;
      }

      mkdirp(dirname, function (err) {
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
          if (cb) {
            cb();
          }
        });
      });
    });
  });
}

exports.run = function (argv, cb) {
  var built = 0;

  path = argv._[0];

  if (!consolidate[argv.e]) {
    utils.error('Template engine', argv.e, 'does not exist');
    process.exit(1);
  }

  _engine = argv.e;

  if (_engine === 'swig') {
    // Swig requires some extra setup
    __swig = require('swig');
    __swig.init({
      root: path,
      allowErrors: false
    });
  }

  _in = new RegExp('^' + path);
  _out = (argv.o[0] === '/') ? argv.o : process.cwd() + '/' + argv.o;
  _encoding = argv.encoding;

  utils.setLevel(argv.v);

  finder = findit.find(path);

  finder.on('file', function (file, stat) {
    var isHTML = (/\.html$/).test(file),
      path;

    if (!isHTML) {
      return;
    }

    path = file.replace(/\.html$/, '');

    if (!files.hasOwnProperty(path)) {
      files[path] = {};
    }

    files += 1;

    _build(file, stat, function () {
      built += 1;
      if (cb && files <= built) {
        cb();
      }
    });
  });

  finder.on('end', function () {
    if (cb && files.length <= built) {
      cb();
    }
  });
};
