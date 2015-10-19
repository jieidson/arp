/**
 * Build site for deployment
 */

'use strict';

//// IMPORT MODULES

var gulp = require('gulp');
var merge2 = require('merge2');
var rename = require('gulp-rename');
var RevAll = require('gulp-rev-all');
var runSequence = require('run-sequence');

//// TASKS

gulp.task('build', ['clean'], function (done) {
  runSequence(['scripts', 'styles', 'fonts', 'images'], 'build:rev', done);
});

gulp.task('build:rev', function () {
  var revAll = new RevAll({
    dontRenameFile: ['.html', '.ico', '.webapp', /^images\/leaflet/],
    dontUpdateReference: ['.html', '.ico', '.webapp'],
    dontSearchFile: ['vendor.js', 'vendor.css']
  });

  var app = gulp.src([
    'app/*',
    '!app/app.ts',
    '!app/app.scss'
  ], { base: '.' })
    .pipe(rename({ dirname: '' }));

  var tmp = gulp.src('tmp/**/*', { base: '.' })
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace(/tmp\/?/, '');
    }));

  return merge2([app, tmp])
    .pipe(revAll.revision())
    .pipe(gulp.dest('dist'));
});
