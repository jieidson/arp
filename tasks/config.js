/**
 * Build configuration
 */

'use strict';

//// IMPORT MODULES

var gitRev = require('git-rev');
var gulp = require('gulp');

module.exports = {
  version: '1.0.0',
  configModule: 'crimesim.config',
  templateModule: 'crimesim.templates'
};

gulp.task('config:git', function (done) {
  gitRev.short(function (short) {
    gitRev.long(function (long) {
      gitRev.branch(function (branch) {
        module.exports.git = {
          short: short,
          long: long,
          branch: branch
        };
        done();
      });
    });
  });
});
