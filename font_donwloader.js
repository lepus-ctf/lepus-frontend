//var url = "https://github.com/adobe-fonts/source-han-sans/archive/1.004R.tar.gz";
var urls = [
"http://mplus-fonts.osdn.jp/webfonts/mplus-2m-regular.ttf",
"http://mplus-fonts.osdn.jp/webfonts/mplus-2p-regular.ttf",
];

//var url = "http://localhost:8000/source-han-code-jp-1.004R.tar.gz";
var fs = require('fs');
var path = require('path');
var dirname = "font"

fs.mkdirSync(dirname);

urls.forEach(function(url) {
	var http = require(url.split(':')[0]);
	http.get(url, function(res) {
		var filename = path.join(dirname, path.basename(url));
		var output = fs.createWriteStream(filename);
		console.log('downloading web font.', filename);
		res.pipe(output);
	}).on('error', function(err) {
		console.log('error', err);
	});
})
