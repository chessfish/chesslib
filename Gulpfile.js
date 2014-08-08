var path = require('path');
var gulp = require('gulp');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var argv = require('minimist')(process.argv);
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', ['core', 'codecs', 'pieces', 'ui']);

gulp.task('core', function () {
	return esify('./src/*.es');
});

gulp.task('codecs', function () {
	return esify('./src/codecs/*.es');
});

gulp.task('pieces', function () {
	return esify('./src/pieces/*.es');
});

gulp.task('ui', function () {
	return esify('./src/ui/*/*.es');
});

gulp.task('browserify', ['default'], function () {
	return (
		browserify().
		require('./lib/index.js', {
			expose: 'chessview'
		}).
		require('mercury', {
			expose: 'mercury'
		}).
		bundle().
		pipe(source('bundle.js')).
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
			sourceMaps: true
		})).
		pipe(rename({
			extname: '.js'
		})).
		pipe(gulp.dest(path.join('lib', p)))
	;
}