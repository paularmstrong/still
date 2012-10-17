var _ = require('lodash'),
  fs = require('fs'),
  consolidate = require('consolidate'),
  utils = require('./utils'),
  optimist = require('optimist'),
  findit = require('findit');

var _engine,
  _out,
  _in,
  _encoding,
  files = {},
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


function _build(file, stat) {
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
}

argv = optimist
  .usage('Usage: still [path] -o [output path] [options]')
  .demand(['o'])
  .describe('o', 'Output directory.')
  .alias('o', 'out')
  .describe('i', 'Copy path to output directory.')
  .alias('i', 'include')
  .describe('e', 'Template Engine to use for rendering')
  .alias('e', 'engine')
  .default('e', 'swig')
  .describe('encoding', 'File encoding (input and output)')
  .default('encoding', 'utf-8')
  .describe('v', 'Be verbose')
  .alias('v', 'verbose')
  .argv;

if (!argv._.length) {
  optimist.showHelp();
  process.exit(1);
}

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
_out = process.cwd() + '/' + argv.o;
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

  if (isHTML) {
    files[path].file = file;
    files[path].stat = {
      atime: new Date(stat.atime),
      ctime: new Date(stat.ctime),
      mtime: new Date(stat.mtime)
    };
  }

  _build(file, stat);
});
