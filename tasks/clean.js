/**
 * Clean output directories
 */

'use strict';

//// IMPORT MODULES

var del = require('del');
var gulp = require('gulp');

gulp.task('clean', function () {
  return del(['tmp', 'dist']);
});
