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
  _ignore = [],
  _path,
  files = 0,
  argv,
  finder,
  __swig;

function _getOutputFile(file) {
  var out = file.replace(_in, _out).replace(/\/{2,}/g, '/');
  if (!(/index\.html$/).test(out)) {
    out = out.replace(/\.html$/, '/index.html');
  }
  return out;
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

exports.build = function (argv, cb) {
  var built = 0;

  _path = argv._[0].replace(/\/$/, '');
  _ignore = ((!_.isArray(argv.i)) ? [argv.i] : argv.i) || [];
  _engine = argv.e;

  _ignore = _.map(_ignore, function (ignore) {
    if ((/^\//).test(ignore) && (/\/$/).test(ignore)) {
      return new RegExp(ignore
        .replace(/^\//, '')
        .replace(/\/$/, ''));
    }
    return ignore;
  });

  if (!consolidate[_engine]) {
    utils.error('Template engine', argv.e, 'does not exist');
    process.exit(1);
  }

  if (_engine === 'swig') {
    // Swig requires some extra setup
    __swig = require('swig');
    __swig.init({
      root: _path,
      allowErrors: false
    });
  }

  _in = new RegExp('^' + _path);
  _out = (argv.o[0] === '/') ? argv.o : process.cwd() + '/' + argv.o;
  _encoding = argv.encoding;

  utils.setLevel(argv.verbose);

  finder = findit.find(_path);

  finder.on('file', function (file, stat) {
    var isHTML = (/\.html$/).test(file),
      path,
      i = _ignore.length;

    while (i) {
      i -= 1;
      if (typeof _ignore[i] === 'object') {
        if (_ignore[i].test(file)) {
          utils.log(file, 'matched', _ignore[i], '- ignoring');
          return;
        }
      } else if (file.indexOf(_ignore[i]) !== -1) {
        utils.log(file, 'contained', _ignore[i], '- ignoring');
        return;
      }
    }

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
