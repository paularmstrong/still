var _ = require('lodash'),
  fs = require('fs'),
  utils = require('./utils');

var CACHE = {},
  _useCache = true,
  now = new Date();

function _read(dataFile, encoding, cb) {
  if (_useCache && CACHE.hasOwnProperty(dataFile)) {
    cb(null, CACHE[dataFile]);
    return;
  }

  fs.readFile(dataFile, encoding, function (err, data) {
    if (!err) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        cb(utils.warn('Data not proper JSON', dataFile), {});
        return;
      }
    } else {
      data = {};
    }
    if (_useCache) {
      CACHE[dataFile] = data;
    }
    cb(null, data);
  });
}

exports.getData = function (file, encoding, cb) {
  var dataFile = file.replace(/html$/, 'json'),
    path = file.split('/'),
    ancestorDataFile;
  path.pop();
  ancestorDataFile = path.join('/') + '.json';

  fs.stat(file, function (err, stats) {
    var data = { now: now, stat: stats };
    _read(dataFile, encoding, function (err, jsonData) {
      if (!err) {
        data = _.extend(data, jsonData);
      }
      _read(ancestorDataFile, encoding, function (err, jsonData) {
        if (!err) {
          data = _.extend(jsonData, data);
        }
        cb(null, data);
      });
    });
  });
};

exports.useCache = function (use) {
  _useCache = !!use;
};
