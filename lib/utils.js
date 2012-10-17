var _ = require('lodash'),
  colors = require('colors'),
  _level;

exports.setLevel = function (level) {
  _level = level;
};

exports.warn = function () {
  if (!_level) {
    return;
  }
  console.warn.apply(null, ['[WARNING]'.yellow].concat(_.toArray(arguments)));
};

exports.log = function () {
  if (!_level || _level <= 1) {
    return;
  }
  console.log.apply(null, ['[LOG]'].concat(_.toArray(arguments)));
};

exports.error = function () {
  console.error.apply(null, ['[ERROR]'.red].concat(_.toArray(arguments)));
};

exports.out = function () {
  console.log.apply(null, [_.toArray(arguments).join(' ').green]);
};
