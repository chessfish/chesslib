var path = require('path');
var gulp = require('gulp');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var argv = require('minimist')(process.argv);
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');

gulp.task('default', ['core']);

gulp.task('core', function () {
	return esify('./src/*.js');
});

gulp.task('browserify', ['default'], function () {
  var compiled = browserifyTask({
    from: './lib/index.js',
    to: 'chesslib.js'
  });

  var umd = browserifyTask({
    from: './lib/index.js',
    to: 'chesslib.umd.js',
    standalone: 'chesslib'
  });

  return merge(compiled, umd);
});

gulp.task('uglify', ['browserify'], function () {
  return merge(
    uglifyTask({ from: 'browser/chesslib.js', to: 'chesslib.min.js' }),
    uglifyTask({ from: 'browser/chesslib.umd.js', to: 'chesslib.umd.min.js' })
  );
});

function esify(src) {
	var p = path.normalize(path.dirname(src)).replace(/^src\/?/, '').replace('*', '');
	var stream = gulp.src(src);

	if (argv.w || argv.watch) {
		stream = stream.pipe(watch());
	}

	return stream.
		pipe(traceur({
			experimental: true,
			sourceMap: true
		})).
		pipe(rename({
			extname: '.js'
		})).
		pipe(gulp.dest(path.join('lib', p)))
	;
}

function browserifyTask(options) {
	var browserifyOptions = {};

	if (options.standalone) {
		browserifyOptions.standalone = options.standalone;
	}

	return (
		browserify(browserifyOptions).
		require(options.from, {
			expose: 'chesslib'
		}).
		bundle().
		pipe(source(options.to)).
		pipe(gulp.dest('browser'))
	);
}

function uglifyTask(options) {
	return (
		gulp.src(options.from).
		pipe(uglify()).
		pipe(rename(options.to)).
		pipe(gulp.dest('browser'))
	);
};
