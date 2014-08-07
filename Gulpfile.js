var path = require('path');
var gulp = require('gulp');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('build', function () {
  esify('./src/*.es');
  esify('./src/pieces/*.es');
});

function esify(src) {
  var p = path.normalize(path.dirname(src)).replace(/^src\/?/, '');
  gulp.src(src)
    .pipe(watch())
    .pipe(traceur({
      experimental: true,
      sourceMaps: true
    }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest(path.join('lib', p)))
  ;
}