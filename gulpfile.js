var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var babelify = require('babelify');

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

var source = require('vinyl-source-stream');


gulp.task('compile', function(){
	return browserify({
		extensions: ['.js', '.jsx'],
		entries: 'src/index.jsx',
	})
	.transform(babelify.configure({
		ignore: /(bower_components)|(node_modules)/
	}))
	.bundle()
	.pipe(source('index.js'))
	.pipe(gulp.dest('js'));
});

gulp.task('demo', function(done){
	var port = process.argv[3];
	port = !!port ? (port.split("=").pop()) : 8000;

	var request = require('request');
	var http = require('http');
	var fs = require('fs');
	var path = require('path');
	var route = function(req, res) {
		var response = function(code, data, contentType) {
			res.writeHead(code, {"Content-Type": contentType ? contentType : "text/plain"});
			res.write(!!data ? data : code + "\n", 'binary');
			res.end();
		}
		var filename = path.join(process.cwd(), req.url);
		fs.exists(filename, function(exists){
			if (!exists) { // proxy to REST API server
				req.pipe(request({method: req.method, port: port, url:  "http://127.0.0.1:" + port + req.url})).pipe(res);
			} else {
				if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }
				fs.readFile(filename, "binary", function(err, file){
					if (err) { response(500); return ; }
					switch (path.extname(filename)) {
						case ".html":
						case ".css":
							response(200, file, "text/" + path.extname(filename).slice(1));
							break;
						case ".js":
							response(200, file, "text/javascript");
							break;
						case ".png":
						case ".jpeg":
						case ".jpg":
						case ".gif":
							response(200, file, "image/" + path.extname(filename).slice(1));
							break;
						case ".svg":
							response(200, file, "image/svg+xml");
							break;
						default:
							response(200, file, "text/plain");
					}
				});
			}
		});
	}

	http.createServer(route).listen(3000, '127.0.0.1');
});
