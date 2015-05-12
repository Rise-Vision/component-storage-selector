/* jshint node: true */

(function () {
  'use strict';

  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var colors = require('colors');

  var concat = require('gulp-concat');
  var bump = require('gulp-bump');
  var html2js = require('gulp-html2js');
  var jshint = require('gulp-jshint');
  var uglify = require('gulp-uglify');
  var runSequence = require('run-sequence');
  var path = require('path');
  var rename = require('gulp-rename');
  var factory = require('widget-tester').gulpTaskFactory;
  var bower = require("gulp-bower");
  var del = require("del");

  gulp.task("clean-bower", function(cb){
    del(["./components/**"], cb);
  });

  gulp.task("clean-dist", function (cb) {
    del(['./dist/**'], cb);
  });

  gulp.task("clean-tmp", function (cb) {
    del(['./tmp/**'], cb);
  });

  gulp.task('clean', ['clean-dist', 'clean-tmp']);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "prod";
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

  gulp.task("lint", function() {
    return gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
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
      'src/config/config.js',
      'src/dtv-storage-selector.js',
      'src/ctr-storage-selector.js',
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

  gulp.task("e2e:server-close", factory.testServerClose());
  gulp.task("e2e:server", factory.testServer());
  gulp.task("webdriver_update", factory.webdriveUpdate());
  gulp.task("test:e2e:ng:core", factory.testE2EAngular());

  gulp.task('test:metrics', factory.metrics());

  gulp.task("test:e2e:ng", ["webdriver_update"], function (cb) {
    return runSequence("e2e:server", "test:e2e:ng:core", "e2e:server-close", cb);
  });

  gulp.task("test:unit:ng", factory.testUnitAngular({
    testFiles: [
      "components/angular/angular.js",
      "components/angular-bootstrap/ui-bootstrap-tpls.js",
      "components/angular-mocks/angular-mocks.js",
      "src/config/dev.js",
      "src/dtv-storage-selector.js",
      "src/ctr-storage-selector.js",
      "test/unit/**/*spec.js"
    ]
  }));

  // ***** Primary Tasks ***** //

  gulp.task("bower-clean-install", ["clean-bower"], function(cb){
    return bower().on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task('test', ['build'], function (cb) {
    return runSequence("test:unit:ng", "test:e2e:ng", "test:metrics", cb);
  });

  gulp.task('build', function (cb) {
    runSequence(['clean', 'config'], ['js-uglify'], cb);
  });

  gulp.task('default', function(){
    console.log('*****************************************************************'.yellow);
    console.log('gulp bower-clean-install : delete and re-install bower components'.yellow);
    console.log('gulp build : one time build of dist'.yellow);
    console.log('gulp test : build and run unit/e2e tests'.yellow);
    console.log('*****************************************************************'.yellow);
  });

})();
