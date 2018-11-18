(function() {

// Libraries
var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var request = require("request");

// Functions
var localizedName = require("../func/localizedName.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current, temp, $) {
    if (typeof temp === 'undefined') temp = current;
	if(true) {
		// Url is a file
		fs.readFile("../drivers/default.js", "utf8", function(err, script) {
			console.message(i, "Downloading '" + localizedName(i) + "'.", MESSAGE_VERBOSE);
			if (err) throw err;
			eval(script); // There must be a better way to do this.
		});
	}
    else {
		// Url is a web page
		fs.readFile("../drivers/" + url.parse(current.url).host + ".js", "utf8", function(err, script) {
			console.message(i, "Checking '" + localizedName(i) + "' for updates.", MESSAGE_VERBOSE);
			if (err) throw err;
			eval(script); // There must be a better way to do this.
		});
	}
}

})();
