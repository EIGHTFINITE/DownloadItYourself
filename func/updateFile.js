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

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current, temp, callback) {
	var updateFile = module.exports;

	if(!current.url) {
		console.message(i, "WARNING: '" + localizedName(i) + "' has no URL to update from.");
		return;
	}

	// Copy current into temp
	if (typeof temp === 'undefined') {
		temp = Object.assign({}, current);
		delete temp.file;
		delete temp.md5;
	}

	// Read the headers of our next url
	request(temp.url).on('response', function(response) {
		var remote = this;

		if(response.headers['content-type'].startsWith('text/html')) {
			// Url is a webpage
			if(!fs.existsSync("../drivers/" + this.host + ".js"))
				throw new Error('Missing driver for ' + this.host);
			var script = fs.readFileSync("../drivers/" + this.host + ".js", "utf8")
			console.message(i, "Checking '" + localizedName(i) + "' for updates.", MESSAGE_VERBOSE);
			eval(script);
		}
		else {
			// Url is a file
			var script = fs.readFileSync("../drivers/default.js", "utf8");
			console.message(i, "Downloading '" + localizedName(i) + "'.", MESSAGE_VERBOSE);
			eval(script);
		}
	});
}

})();
