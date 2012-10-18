var _ = require('lodash'),
  express = require('express'),
  consolidate = require('consolidate'),
  fs = require('fs'),
  utils = require('./utils');

exports.run = function (argv) {
  var app = express(),
    path = argv._[0],
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
      allowErrors: true
    });
  }

  app.engine('.html', consolidate[engine]);
  app.set('view engine', 'html');
  app.set('views', path);

  app.get('/*', function (req, res) {
    var param = _.first(req.params),
      tpl = ((/\/$/).test(param)) ? param + 'index' : param,
      dataFile = path + '/' + tpl + '.json';
    fs.readFile(dataFile, encoding, function (err, jsonData) {
      var data = {};

      if (err) {
        utils.warn('No data for file', tpl);
      } else {
        try {
          data = _.extend(data, JSON.parse(jsonData));
        } catch (e) {
          utils.warn('Data not proper JSON', dataFile);
        }
      }

      res.render(tpl, data);
    });
  });

  app.listen(port);
};
