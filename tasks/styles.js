/**
 * Compile SASS/SCSS to CSS, and run autoprefixer.
 */

'use strict';

//// IMPORT MODULES

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').get('server');
var concat = require('gulp-concat');
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');

//// CONFIG

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

//// TASKS

function onError(err) {
  console.error('SASS:', err.messageFormatted);
  browserSync.notify(err.message, 5000);

  // Let watch restart cleanly
  this.emit('end');
}

gulp.task('styles', function (done) {
  runSequence(['styles:app', 'styles:vendor'], done);
});

gulp.task('styles:app', function () {
  return gulp.src('app/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', onError))
    .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))

    .pipe(concat('app.css'))
    .pipe(minifyCss())

    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('tmp/styles'))
    .pipe(size({ title: 'styles:app' }))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('styles:vendor', function () {
  return gulp.src(mainBowerFiles('**/*.css'))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.css'))
    .pipe(minifyCss({
      keepSpecialComments: '*'
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('tmp/styles'))
    .pipe(size({ title: 'styles:vendor' }))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});
