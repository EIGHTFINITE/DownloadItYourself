(function() {

// Libraries
var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var cloudscraper = require("cloudscraper");
var md5File = require("md5-file");

// Functions
var updateFile = require("../src/updateFile.js");
var localizedName = require("../src/localizedName.js");
var shortUrl = require("../src/shortUrl.js");
var nthIndex = require("../src/nthIndex.js");
var callback = function(current){
	console.log('VariableAlteration$current:' + JSON.stringify(current));
	process.exit(256); // Treated as exit code 0 by bad software. This doesn't matter since we're only passing it between Node processes.
};

// Globals
global.list = void(0);
global.downloads = void(0);
global.config = void(0);

// Ciphers
if(!/(^|:)!SHA($|:)/.test(cloudscraper.defaultParams.agentOptions.ciphers))
	cloudscraper.defaultParams.agentOptions.ciphers += ':!SHA';
if(!/(^|:)!ECDHE+SHA($|:)/.test(cloudscraper.defaultParams.agentOptions.ciphers))
	cloudscraper.defaultParams.agentOptions.ciphers += ':!ECDHE+SHA';
if(!/(^|:)!AES128-SHA($|:)/.test(cloudscraper.defaultParams.agentOptions.ciphers))
	cloudscraper.defaultParams.agentOptions.ciphers += ':!AES128-SHA';
if(!/(^|:)!AESCCM($|:)/.test(cloudscraper.defaultParams.agentOptions.ciphers))
	cloudscraper.defaultParams.agentOptions.ciphers += ':!AESCCM';
if(!/(^|:)!DHE($|:)/.test(cloudscraper.defaultParams.agentOptions.ciphers))
	cloudscraper.defaultParams.agentOptions.ciphers += ':!DHE';
if(!/(^|:)!ARIA($|:)/.test(cloudscraper.defaultParams.agentOptions.ciphers))
	cloudscraper.defaultParams.agentOptions.ciphers += ':!ARIA';

// Disable certificate verification
// Yes, I am fully aware of what this does. We need to be able to communicate with websites even if their certificates expire. This is not a security risk because we verify hashes after downloading.
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// Variables
var MESSAGE_VERBOSE = true;
var temp = JSON.parse(process.argv.pop());
var current = JSON.parse(process.argv.pop());
var i = JSON.parse(process.argv.pop());

fs.readFile("../downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    // Fill globals
    global.list = JSON.parse(data);
    global.downloads = global.list.downloads;
    global.config = global.list.config;

	// Read the headers of our next url
	cloudscraper(temp.cookie ? {headers: {"Cookie": temp.cookie}, url: temp.url} : temp.url, function(err, response, html){
		var remote = this;
		// Connection error
		if(err) {
			console.log("WARNING: '" + shortUrl(remote.href) + "' failed with error '" + JSON.stringify(err) + "'. Retrying…");
			updateFile(i, current, temp, callback);
			return;
		}
		// Server error
		if(response.statusCode !== 200) {
			console.log("WARNING: '" + shortUrl(remote.href) + "' failed with error code: '" + response.statusCode + "'. Retrying…");
			updateFile(i, current, temp, callback);
			return;
		}
		// If URL is a webpage
		if(response.headers['content-type'].startsWith('text/html')) {
			if(!fs.existsSync("../drivers/" + remote.host + ".js"))
				throw new Error("Missing driver for '" + remote.host + "'. URL was '" + remote.href + "'");
			var script = fs.readFileSync("../drivers/" + remote.host + ".js", "utf8");
			console.log("Navigating to '" + shortUrl(temp.url) + "'.");
			try {
				eval(script);
			} catch(er) {
				if(er.toString() === "Error: Couldn't find download link.") {
					console.log("WARNING: '" + shortUrl(remote.href) + "' failed with error \"Couldn't find download link.\" Retrying…");
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
			console.log("Downloading '" + shortenedUrl + (shortenedUrl.substring(shortenedUrl.lastIndexOf("/") + 1) === temp.file ? "" : "' as '" + temp.file) + "'.");
			var script = fs.readFileSync("../drivers/default.js", "utf8");
			try {
				eval(script);
			} catch(er) {
				throw er;
			}
		}
	});
});


})();
