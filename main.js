(function() {

// Libraries
var fs = require("fs-extra");
var stringify = require("json-stable-stringify");

// Ensure correct working directory
fs.ensureDirSync(__dirname + "/_temp");
process.chdir(__dirname + "/_temp");

// Functions
var checkFile = require("./func/checkFile.js");
var parseDownload = require("./func/parseDownload.js");
var downloadFile = require("./func/downloadFile.js");
console.message = require("./func/message.js");
var registerThread = require("./func/registerThread.js");

// Globals
global.list = void(0);
global.downloads = void(0);
global.config = void(0);
global.delayedLog = [];
global.finishedThreads = -1;
global.threads = [];

// Load config and get started
fs.readFile("../downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    // Fill globals
    global.list = JSON.parse(data);
    global.downloads = global.list.downloads;
    global.config = global.list.config;
    // Start working
    var current;
    for (var i = 0; i < global.downloads.length; i++) {
        current = global.downloads[i];
		registerThread(i);
        checkFile(i, current);
        if (current.url) parseDownload(i, current);
    }
});

// After everything is done (even if we error out)
process.on('exit', function() {
	// Warn about unclosed threads
	for (var j = 0; j < global.threads.length; j++) {
		if(global.threads[j] === true) {
			console.log("WARNING: Thread [" + j + "] has not been closed.");
			global.threads[j] = false;
		}
	}
	// Process leftover messages
	if (global.config["delayed-log"] && global.delayedLog.length) {
		console.log("WARNING: Not all messages were pushed to the console. Appending messages now.");
		var delayedLogCopy = global.delayedLog.slice();
		var numberLength = global.downloads.length.toString().length;
		global.delayedLog.sort(function(a, b) {
			var aInt = parseInt(a.substring(1, numberLength + 1));
			var bInt = parseInt(b.substring(1, numberLength + 1));
			if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
			return aInt - bInt;
		});
		while (global.delayedLog.length) {
			console.log(global.delayedLog.shift());
		}
	}
	// Save downloadlist
    global.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    if(global.list !== void(0)) fs.writeFileSync("../downloadlist.json", stringify(global.list, { space: 4 }) + "\n");
});

})();
