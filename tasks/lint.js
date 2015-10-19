/**
 * Lint code
 */

'use strict';

//// IMPORT MODULES

var browserSync = require('browser-sync').get('server');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var path = require('path');
var tslint = require('gulp-tslint');
var util = require('util');

//// FUNCTIONS

function tsReporter(failures) {
  failures.forEach(function (failure) {
    // line + 1 because TSLint's first line and character is 0
    var message = util.format('(tslint %s) %s[%d, %d]: %s',
        failure.ruleName, failure.name, failure.startPosition.line + 1,
        failure.startPosition.character + 1, failure.failure);

    console.error(message);
    browserSync.notify(message, 5000);
  });
}

function jsReporter(files) {
  files.forEach(function (file) {
    var p = path.relative(path.join(__dirname, '/..'), file.filePath);
    file.messages.forEach(function (error) {
      var message = util.format('(eslint %s) %s[%d, %d]: %s',
          error.ruleId, p, error.line, error.column,
          error.message);

      console.error(message);
      browserSync.notify(message, 5000);
    });
  });
}

//// TASKS

gulp.task('lint:js', function () {
  return gulp.src([
    'gulpfile.js',
    'tasks/**/*.js'
  ])
    .pipe(eslint({
      configFile: 'eslint.json',
      useEslintrc: false
    }))
    .pipe(eslint.format(jsReporter));
});

gulp.task('lint:ts:dev', function () {
  return gulp.src(['app/**/*.ts', 'worker/**/*.ts'])
    .pipe(tslint())
    .pipe(tslint.report(tsReporter));
});

gulp.task('lint:ts:prod', function () {
  return gulp.src(['app/**/*.ts', 'worker/**/*.ts'])
    .pipe(tslint({
      configuration: {
        rules: {
          'no-debugger': true,
          'no-console': [true,
            'debug',
            'info',
            'time',
            'timeEnd',
            'trace',
            'log'
          ]
        }
      }
    }))
    .pipe(tslint.report(tsReporter));
});
