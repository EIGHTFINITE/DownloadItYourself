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
		console.message(i, "WARNING: '" + localizedName(i) + "' has no URL. It will not be updated.");
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
	request(temp.cookie ? {headers: {"Cookie": temp.cookie}, url: temp.url} : temp.url, function(err, response, html){
		var remote = this;
		// Connection error
		if(err) {
			console.message(i, "WARNING: '" + shortUrl(remote.href) + "' failed with error '" + err.code + "'. Retrying…");
			updateFile(i, current, temp, callback);
			return;
		}
		// Server error
		if(response.statusCode !== 200) {
			console.message(i, "WARNING: '" + shortUrl(remote.href) + "' failed with error '" + response.statusCode + "'. Retrying…");
			updateFile(i, current, temp, callback);
			return;
		}
		// If URL is a webpage
		if(response.headers['content-type'].startsWith('text/html')) {
			if(!fs.existsSync("../drivers/" + remote.host + ".js"))
				throw new Error("Missing driver for '" + remote.host + "'. URL was '" + remote.href + "'");
			var script = fs.readFileSync("../drivers/" + remote.host + ".js", "utf8");
			console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
			try {
				eval(script);
			} catch(er) {
				if(er.toString() === "Error: Couldn't find download link.") {
					console.message(i, "WARNING: '" + shortUrl(remote.href) + "' failed with error \"Couldn't find download link.\" Retrying…");
					updateFile(i, current, temp, callback);
					return;
				}
				throw er;
			}
		}
	}).on('response', function(response) {
		var remote = this;

		// If URL is a file
		if(!response.headers['content-type'].startsWith('text/html')) {
			if(!("file" in temp))
				temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
			var shortenedUrl = shortUrl(remote.href, temp.file);
			console.message(i, "Downloading '" + shortenedUrl + (shortenedUrl.substring(shortenedUrl.lastIndexOf("/") + 1) === temp.file ? "" : "' as '" + temp.file) + "'.");
			var script = fs.readFileSync("../drivers/default.js", "utf8");
			try {
				eval(script);
			} catch(er) {
				throw er;
			}
		}
	});
}

})();
