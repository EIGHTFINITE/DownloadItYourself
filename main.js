(function() {

// Executable check
var isIojs = require('is-iojs');
if (isIojs) {
	throw new Error("EIGHTFINITE-build does not support io.js");
}

// Libraries
var fs = require("fs-extra");
var stringify = require("json-stable-stringify");

// Ensure correct working directory
fs.ensureDirSync(__dirname + "/_temp");
process.chdir(__dirname + "/_temp");

// Functions
var checkFile = require("./func/checkFile.js");
var updateFile = require("./func/updateFile.js");
var execCmd = require("./func/execCmd.js");
var copyFile = require("./func/copyFile.js");
console.message = require("./func/message.js");

// Globals
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // Yes, I am aware of what this does. We don't care if the remote has a valid cert. We check file hashes after downloading.
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
    for (var i = 0; i < global.downloads.length; i++) {
		(function(i) {
			var current = global.downloads[i];
			checkFile(i, current, function(){ // Check integrity
			updateFile(i, current, void(0), function(){ // Download updates
			copyFile(i, current, function(){ // Copy files
			execCmd(i, current)})})}); // Execute commands
		})(i);
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

}());
