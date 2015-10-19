/**
 * Run development server, watch for changes.
 */

'use strict';

//// IMPORT MODULES

var browserSync = require('browser-sync').get('server');
var gulp = require('gulp');
var modrewrite = require('connect-modrewrite');
var runSequence = require('run-sequence');

//// TASKS

gulp.task('serve:reload', function () {
  browserSync.reload();
});

gulp.task('serve:init', function (done) {
  runSequence('clean', ['scripts', 'styles', 'fonts', 'images'], done);
});

gulp.task('serve', ['serve:init'], function (done) {
  var started = false;

  var watch = function (globs, tasks) {
    var f = function () {
      if (!started) {
        return;
      }
      gulp.start(tasks);
    };
    browserSync
      .watch(globs)
      .on('add', f)
      .on('change', f)
      .on('unlink', f);
  };

  watch('app/images/**/*', ['images']);
  watch('app/**/*.scss', ['styles:app']);
  watch('app/components/**/*.html', ['scripts:app']);
  watch('app/*', ['serve:reload']);
  watch('app/**/*.ts', ['lint:ts:dev', 'scripts:app']);
  watch('worker/**/*.ts', ['lint:ts:dev', 'scripts:worker']);
  watch('shared/**/*.ts', ['lint:ts:dev', 'scripts:app', 'scripts:worker']);

  watch('bower.json', ['scripts:vendor', 'styles:vendor', 'fonts', 'images']);
  watch('worker/bower.json', ['scripts:worker:vendor']);
  watch(['gulpfile.js', 'tasks/**/*.js'], ['lint:js']);

  browserSync.init({
    ghostMode: false,
    open: false,
    server: {
      baseDir: ['tmp', 'app'],
      middleware: [
        modrewrite([
          // For angular html5mode
          '!\\.\\w+(\\?.*)?$ /index.html [L]'
        ])
      ]
    }
  }, function (err) {
    if (err) {
      throw err;
    }
    started = true;
    done();
  });
});
