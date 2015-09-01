var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var packager = require('electron-packager');

gulp.task('compile', function(){
	return gulp.src('src/**/*.{js,jsx}')
		.pipe(
			$.babel({
				stage: 0
			})
		)
		.pipe(gulp.dest('js'));
});

var commonOption = {
		dir: './',
		out: 'release',
		name: 'Lepus-CTF',
		arch: 'all',
		platform: 'all',
		asar: true,
		ignore: [
			'./node_modules/electron*',
			'./node_modules/.bin',
			'./release/',
			'./src/',
			'./.git*'
		],
		version: '0.30.6'
}

gulp.task('package:darwin', ['compile'], function (done) {
	var option = commonOption;
	option.platform = 'darwin';
	option.arch = 'x64';
	packager(option, function (err, path) {
		done();
	});
});

gulp.task('package:linux:ia32', ['compile'], function (done) {
	var option = commonOption;
	option.platform = 'linux';
	option.arch = 'ia32';
	packager(option, function (err, path) {
		done();
	});
});

gulp.task('package:linux:x64', ['compile'], function (done) {
	var option = commonOption;
	option.platform = 'linux';
	option.arch = 'x64';
	packager(option, function (err, path) {
		done();
	});
});

gulp.task('package:win32:ia32', ['compile'], function (done) {
	var option = commonOption;
	option.platform = 'win32';
	option.arch = 'ia32';
	packager(option, function (err, path) {
		done();
	});
});

gulp.task('package:win32:x64', ['compile'], function (done) {
	var option = commonOption;
	option.platform = 'win32';
	option.arch = 'x64';
	packager(option, function (err, path) {
		done();
	});
});

gulp.task('package:all', [
		'package:darwin',
		'package:linux:ia32',
		'package:linux:x64',
		'package:win32:ia32',
		'package:win32:x64'], function (done) {
	done();
});

