var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var packager = require('electron-packager');

gulp.task('download:font', function (done) {
	var urls = [
		"http://mplus-fonts.osdn.jp/webfonts/mplus-2m-regular.ttf",
		"http://mplus-fonts.osdn.jp/webfonts/mplus-2p-regular.ttf",
	];

	var fs = require('fs');
	var path = require('path');
	var dirname = "font"

	if (fs.existsSync(dirname)) {
		// Already exists. Skip downloading font.
		return done();
	}
	fs.mkdirSync(dirname);

	console.log('downloading web font.');

	process.on('download', function(i) {
		var url = urls[i];
		if (!url) {
			return done();
		}
		console.log(url);
		var http = require(url.split(':')[0]);
		http.get(url, function(res) {
			var filename = path.join(dirname, path.basename(url));
			var output = fs.createWriteStream(filename);
			res.pipe(output);
			res.on('end', function() {
				process.nextTick(function() {
					process.emit('download', ++i);
				})
			});
		}).on('error', function(err) {
			console.log('error', err);
		});
	})
	process.emit('download', 0);
});

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

