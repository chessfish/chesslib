var path = require('path');
var gulp = require('gulp');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var argv = require('minimist')(process.argv);
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', ['core']);

gulp.task('core', function () {
	return esify('./src/*.js');
});

gulp.task('browserify', ['default'], function () {
	return (
		browserify().
		require('./lib/index.js', {
			expose: 'chesslib'
		}).
		bundle().
		pipe(source('chesslib.js')).
		pipe(gulp.dest('browser'))
	);
});

gulp.task('uglify', ['browserify'], function () {
	return (
		gulp.src('browser/chesslib.js').
		pipe(uglify()).
		pipe(rename('chesslib.min.js')).
		pipe(gulp.dest('browser'))
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
