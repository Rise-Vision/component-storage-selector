/* jshint node: true */

(function () {
  'use strict';

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var colors = require('colors');

  var rimraf = require('gulp-rimraf');
  var concat = require('gulp-concat');
  var bump = require('gulp-bump');
  var html2js = require('gulp-html2js');
  var jshint = require('gulp-jshint');
  var uglify = require('gulp-uglify');
  var runSequence = require('run-sequence');
  var path = require('path');
  var rename = require('gulp-rename');
  var factory = require('widget-tester').gulpTaskFactory;

  gulp.task('clean-dist', function () {
    return gulp.src('dist', {read: false})
      .pipe(rimraf());
  });

  gulp.task('clean-tmp', function () {
    return gulp.src('tmp', {read: false})
      .pipe(rimraf());
  });

  gulp.task('clean', ['clean-dist', 'clean-tmp']);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  gulp.task('bump', function(){
    return gulp.src(['./package.json', './bower.json'])
      .pipe(bump({type:'patch'}))
      .pipe(gulp.dest('./'));
  });

  gulp.task('lint', function() {
    return gulp.src([
      'src/**/*.js',
      'test/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
  });



  gulp.task('angular:html2js', function() {
    return gulp.src('src/*.html')
      .pipe(html2js({
        outputModuleName: 'risevision.widget.common.storage-selector',
        useStrict: true,
        base: 'src'
      }))
      .pipe(rename({extname: '.js'}))
      .pipe(gulp.dest('tmp/ng-templates'));
  });

  gulp.task('angular', ['angular:html2js', 'lint'], function () {
    return gulp.src([
      'src/**/*.js',
      'tmp/ng-templates/*.js'])

      .pipe(concat('storage-selector.js'))
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('js-uglify', ['angular'], function () {
    gulp.src('dist/**/*.js')
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += '.min';
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('build', function (cb) {
    runSequence(['clean', 'config'], ['js-uglify'], cb);
  });

  gulp.task("e2e:server-close", factory.testServerClose());
  gulp.task("e2e:server", factory.testServer());
  gulp.task("webdriver_update", factory.webdriveUpdate());
  gulp.task("test:ensure-directory", factory.ensureReportDirectory());

  gulp.task('test:metrics', factory.metrics());

  gulp.task("test:e2e:ng", ["webdriver_update"], factory.testE2EAngular());

  gulp.task("test:unit:ng", factory.testUnitAngular({
    testFiles: [
      "components/q/q.js",
      "components/angular/angular.js",
      "components/angular-mocks/angular-mocks.js",
      "node_modules/widget-tester/mocks/common-mock.js",
      "src/config/test.js",
      "src/*.js",
      "test/unit/**/*spec.js"
    ]
  }));

  gulp.task('test', ['build'], function (cb) {
    return runSequence("test:unit:ng", "test:e2e:ng", "test:metrics", cb);
  });

  gulp.task('dev',function(){
    gulp.watch('./src/**/*', ['build']);
  });

  gulp.task('default', function(){
    console.log('*************'.yellow);
    console.log('gulp dev - watch source files and auto build dist on change'.yellow);
    console.log('gulp build - one time build of dist'.yellow);
    console.log('gulp test - build and run unit/e2e tests');
    console.log('*************'.yellow);

  });

})();
