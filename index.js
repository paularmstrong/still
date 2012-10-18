var dir = (process.env.STILL_COVERAGE) ? './lib-cov/' : './lib/';

exports.build = require(dir + 'build');
exports.server = require(dir + 'server');
