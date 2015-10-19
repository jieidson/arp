'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

// Create a BrowserSync instance for other modules to use.
require('browser-sync').create('server');

// Load tasks from "tasks" directory.
require('require-dir')('tasks');

gulp.task('default', function (done) {
  runSequence('build', done);
});
