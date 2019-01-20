(function() {

// Libraries
var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var request = require("request");
var md5File = require("md5-file");

// Functions
var localizedName = require("../func/localizedName.js");
var closeThread = require("../func/closeThread.js");
var shortUrl = require("../func/shortUrl.js");
var nthIndex = require("../func/nthIndex.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current, temp, callback) {
	var updateFile = module.exports;

	if(!current.url) {
		console.message(i, "WARNING: '" + localizedName(i) + "' has no URL. It will not be updated.", MESSAGE_VERBOSE);
		callback();
		return;
	}

	// Check protocol
	if(!current.url.startsWith('https://') && !current.url.startsWith('http://'))
		throw new Error("Unknown protocol.");

	// Copy current into temp
	if (typeof temp === 'undefined') {
		temp = Object.assign({}, current);
		delete temp.file;
		delete temp.md5;
		console.message(i, "Checking '" + localizedName(i) + "' for updates.");
	}

	// Read the headers of our next url
	request(temp.cookie ? {headers: {"Cookie": temp.cookie}, url: temp.url} : temp.url).on('response', function(response) {
		var remote = this;

		if(response.headers['content-type'].startsWith('text/html')) {
			// Url is a webpage
			if(!fs.existsSync("../drivers/" + this.host + ".js"))
				throw new Error('Missing driver for ' + this.host);
			var script = fs.readFileSync("../drivers/" + this.host + ".js", "utf8")
			eval(script);
		}
		else {
			// Url is a file
			var script = fs.readFileSync("../drivers/default.js", "utf8");
			if(!("file" in temp))
				temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
			var shortenedUrl = shortUrl(remote.href, temp.file);
			console.message(i, "Downloading '" + shortenedUrl + (shortenedUrl.substring(shortenedUrl.lastIndexOf("/") + 1) === temp.file ? "" : "' as '" + temp.file) + "'.");
			eval(script);
		}
	});
}

})();
