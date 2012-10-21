var _ = require('lodash'),
  colors = require('colors'),
  _level;

exports.setLevel = function (level) {
  _level = parseInt(level, 10);
};

exports.warn = function () {
  // 2
  if (_level <= 1) {
    return;
  }
  console.warn.apply(null, ['[WARNING]'.yellow].concat(_.toArray(arguments)));
};

exports.log = function () {
  // 3
  if (_level <= 2) {
    return;
  }
  console.log.apply(null, ['[LOG]'].concat(_.toArray(arguments)));
};

exports.error = function () {
  // 1
  if (_level < 1) {
    return;
  }
  var args = _.toArray(arguments);
  console.error.apply(null, ['[ERROR]'.red].concat(args));
  return new Error(args.join(' '));
};

exports.out = function () {
  // 1
  if (_level < 1) {
    return;
  }
  console.log.apply(null, [_.toArray(arguments).join(' ').green]);
};
