var path = require('path');
var gulp = require('gulp');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var argv = require('minimist')(process.argv);

gulp.task('build', function (options) {
  esify('./src/*.es');
  esify('./src/pieces/*.es');
});

function esify(src) {
  var p = path.normalize(path.dirname(src)).replace(/^src\/?/, '');
  var stream = gulp.src(src);

  if (argv.w || argv.watch) {
    stream = stream.pipe(watch());
  }

  stream.
    pipe(traceur({
      experimental: true,
      sourceMaps: true
    })).
    pipe(rename({
      extname: '.js'
    })).
    pipe(gulp.dest(path.join('lib', p)))
  ;
}