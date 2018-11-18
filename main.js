(function() {

// Libraries
var fs = require("fs-extra");
var stringify = require("json-stable-stringify");

// Ensure correct working directory
fs.ensureDirSync(__dirname + "/_temp");
process.chdir(__dirname + "/_temp");

// Functions
var checkFile = require("./func/checkFile.js");
var updateFile = require("./func/updateFile.js");
console.message = require("./func/message.js");

// Globals
global.list = void(0);
global.downloads = void(0);
global.config = void(0);
global.delayedLog = [];
global.threads = [];
global.checks = [];

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
        checkFile(i, current);
        if (current.url) updateFile(i, current);
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
		console.message();
	}
	// Save downloadlist
    global.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    if(global.list !== void(0)) fs.writeFileSync("../downloadlist.json", stringify(global.list, { space: 4 }) + "\n");
});

})();
