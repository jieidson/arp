/**
 * Copy and optimize images for distribution.
 */

'use strict';

//// IMPORT MODULES

var browserSync = require('browser-sync').get('server');
var changed = require('gulp-changed');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var mainBowerFiles = require('main-bower-files');
var rename = require('gulp-rename');
var size = require('gulp-size');

//// FUNCTIONS

/** Remove these path prefixes to put all images in a consistent directory. */
function stripPathPrefix(path) {
  var paths = ['app/images', 'bower_components'];

  paths.some(function (key) {
    if (path.dirname.indexOf(key) === 0) {
      path.dirname = path.dirname.substr(key.length);

      if (path.dirname.indexOf('/') === 0) {
        path.dirname = path.dirname.substr(1);
      }

      return true;
    }
  });
}

//// TASKS

gulp.task('images', function () {
  var src = mainBowerFiles('**/*.png')
      .concat('app/images/**/*');

  gulp.src(src, { base: '.' })
    .pipe(rename(stripPathPrefix))
    .pipe(changed('dist/images'))
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('tmp/images'))
    .pipe(size({ title: 'images' }))
    .pipe(browserSync.stream());
});
