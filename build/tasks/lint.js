/*var gulp = require('gulp');
var paths = require('../paths');
var eslint = require('gulp-eslint');

// runs eslint on all .js files
gulp.task('lint', function() {
  return gulp.src(paths.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
*/

var gulp = require('gulp');
var paths = require('../paths');
var tslint = require('gulp-tslint');

gulp.task('lint', function () {
    return gulp.src(paths.source)
      .pipe(tslint())
      .pipe(tslint.report('prose', {
          emitError: false
      }));
});