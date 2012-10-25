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
  console.warn.apply(null, [
    'still',
    'warn'.yellow,
  ].concat(_.toArray(arguments)));
};

exports.log = function () {
  // 3
  if (_level <= 2) {
    return;
  }
  console.log.apply(null, [
    'still',
    'info'.cyan
  ].concat(_.toArray(arguments)));
};

exports.error = function () {
  // 1
  if (_level < 1) {
    return;
  }
  var args = _.toArray(arguments);
  console.error.apply(null, [
    'still',
    'error'.red
  ].concat(args));
};

exports.out = function () {
  // 1
  if (_level < 1) {
    return;
  }
  var args = _.toArray(arguments);

  console.log.apply(null, [
    'still',
    'info'.green,
    args.shift().magenta,
  ].concat(args));
};
