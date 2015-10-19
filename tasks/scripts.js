/**
 * Compile TypeScript code
 */

'use strict';

//// IMPORT MODULES

var angularTemplateCache = require('gulp-angular-templatecache');
var argv = require('yargs').argv;
var browserSync = require('browser-sync').get('server');
var concat = require('gulp-concat');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var mainBowerFiles = require('main-bower-files');
var merge2 = require('merge2');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var runSequence = require('run-sequence');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var typescript = require('typescript');
var uglify = require('gulp-uglify');
var wrapJs = require('gulp-wrap-js');

var config = require('./config');

//// TASKS

var project = ts.createProject({
  noEmitOnError: true,
  noExternalResolve: true,
  noImplicitAny: true,
  target: 'ES5',
  typescript: typescript
});

var workerProject = ts.createProject({
  noEmitOnError: true,
  noExternalResolve: true,
  noImplicitAny: true,
  noLib: true,
  target: 'ES5',
  typescript: typescript
});

function tsReporter(err) {
  console.error(err.message);
  browserSync.notify(err.message, 5000);
}

function htmlminReporter(err) {
  console.error('htmlmin error:', err.message);
  browserSync.notify('Template parsing error', 5000);

  // Let watch restart cleanly
  this.emit('end');
}

gulp.task('scripts', function (done) {
  runSequence('config:git', ['scripts:app', 'scripts:vendor', 'scripts:worker', 'scripts:worker:vendor'], done);
});

gulp.task('scripts:system', function () {
  return gulp.src([
    'bower_components/system.js/dist/system.js',
    'worker/index.js'
  ])
    .pipe(gulp.dest('tmp/scripts'))
    .pipe(size({ title: 'scripts:system' }));
});

//gulp.task('scripts:app', ['config:git', 'scripts:system'], function () {
gulp.task('scripts:app', function () {
  var templates = gulp.src('app/components/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }).on('error', htmlminReporter))
    .pipe(angularTemplateCache({
      module: config.templateModule,
      standalone: true
    }));

  var scripts = gulp.src([
    'app/**/*Module.ts',
    'app/**/*.ts',
    'typings/**/*.d.ts'
  ])
    .pipe(sourcemaps.init())
    .pipe(ts(project, undefined, { error: tsReporter }))
    .pipe(wrapJs('(function () {\n\'use strict\';\n%= body %}());'));

  var constants = ngConstant({
    name: config.configModule,
    stream: true,
    constants: {
      CONFIG: {
        version: config.version,
        debug: !argv.release,
        git: config.git
      }
    }
  });

  return merge2(scripts, templates, constants)
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('tmp/scripts'))
    .pipe(size({ title: 'scripts:app' }))
    .pipe(browserSync.stream({ match: '**/*.js' }));
});

gulp.task('scripts:worker', function () {
  return gulp.src([
    'worker/**/*.ts',
    'node_modules/typescript/lib/lib.core.d.ts',
    'node_modules/typescript/lib/lib.webworker.d.ts'
  ])
    .pipe(sourcemaps.init())
    .pipe(ts(workerProject, undefined, { error: tsReporter }))
    .pipe(concat('worker.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('tmp/scripts'))
    .pipe(size({ title: 'scripts:worker' }))
    .pipe(browserSync.stream({ match: '**/*.js' }));
});

gulp.task('scripts:vendor', function () {
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('tmp/scripts'))
    .pipe(size({ title: 'scripts:vendor' }))
    .pipe(browserSync.stream({ match: '**/*.js' }));
});

gulp.task('scripts:worker:vendor', function () {
  return gulp.src(mainBowerFiles('**/*.js', {
    paths: { bowerJson: './worker/bower.json' }
  }))
    .pipe(concat('worker-vendor.js'))
    .pipe(gulp.dest('tmp/scripts'))
    .pipe(size({ title: 'scripts:workervendor' }))
    .pipe(browserSync.stream({ match: '**/*.js' }));
});
