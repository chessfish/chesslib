var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var joinPath = require('path').join;

exports.getFiles = getFiles;
exports.getFile = getFile;

function getFiles(path) {
	return (
		fs.readdirAsync(path).
		filter(function (filename) {
			return filename.charAt(0) !== '.';
		}).
		bind({}).
		tap(function (filenames) { this.filenames = filenames; }).
		map(function (filename) {
			return getFile(joinPath(path, filename));
		})
	);
}

function getFile(path) {
	return fs.readFileAsync(path, 'utf-8');
}