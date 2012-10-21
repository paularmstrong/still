var child_process = require('child_process');

exports.teardown = function (cb) {
  child_process.exec('make clean', cb);
};
