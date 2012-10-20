var _ = require('lodash'),
  express = require('express'),
  consolidate = require('consolidate'),
  fs = require('fs'),
  utils = require('./utils');

var app = express();

function findHTML(file, path, cb) {
  file = file || 'index';
  fs.exists(path + file + '.html', function (exists) {
    if (!exists && (/index$/).test(file)) {
      cb('File not found: ' + path + file);
      return;
    }

    if (!exists) {
      findHTML(file + '/index', path, cb);
      return;
    }

    file = file + '.html';

    fs.stat(path + file, function (err, stats) {
      cb(null, file, stats);
    });
  });
}

exports.run = function (argv) {
  var path = argv._[0],
    engine = argv.e,
    encoding = argv.encoding,
    port = argv.p,
    __swig;

  app.use(express.logger('dev'));
  app.use(app.router);

  if (!consolidate[engine]) {
    utils.error('Template engine', engine, 'does not exist');
    process.exit(1);
  }

  if (engine === 'swig') {
    // Swig requires some extra setup
    __swig = require('swig');
    __swig.init({
      root: path,
      allowErrors: true,
      cache: false
    });
  }

  app.engine('.html', consolidate[engine]);
  app.set('view engine', 'html');
  app.set('views', path);

  app.get('/*', function (req, res) {
    var view = _.first(req.params).replace(/\/$/, '');

    findHTML(view, path, function (err, tpl, stat) {
      if (err) {
        try {
          res.sendfile(path + view);
        } catch (e) {
          utils.error('View not found for', view);
        }
        return;
      }

      var dataFile = tpl.replace(/\.html$/, '.json');

      fs.readFile(path + dataFile, encoding, function (err, jsonData) {
        var data = {};

        if (err) {
          utils.warn('No data for file', tpl);
        } else {
          try {
            data = _.extend({ DEV: true }, stat, JSON.parse(jsonData));
          } catch (e) {
            utils.warn('Data not proper JSON', dataFile);
          }
        }

        res.render(tpl, data);
      });

    });
  });

  app.listen(port);
  utils.log('Server listening on port', port);
};
