(function() {

// Executable check
var isIojs = require('is-iojs');
if (isIojs) {
	throw new Error("EIGHTFINITE-build does not support io.js");
}

// Libraries
var fs = require("fs-extra");
var stringify = require("json-stable-stringify");

// Functions
var checkFile = require("./src/checkFile.js");
var updateFile = require("./src/updateFile.js");
var execCmd = require("./src/execCmd.js");
var copyFile = require("./src/copyFile.js");
var createReadme = require("./src/createReadme.js");
console.message = require("./src/message.js");

// Ensure correct working directory
fs.ensureDirSync(__dirname + "/_download");
process.chdir(__dirname + "/_download");

// Globals
global.list = void(0);
global.downloads = void(0);
global.config = void(0);
global.delayedLog = [];
global.threads = [];
global.noExecOrUpdateIsFinished = []; // Keep track of the current state of the thread to avoid closing it before we're done

// Load config and get started
fs.readFile("../downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    // Fill globals
    global.list = JSON.parse(data);
    global.downloads = global.list.downloads;
    global.config = global.list.config;

	// Try to clean up the _download/_temp directory
	fs.rmdir(__dirname + "/_download/_temp", function(err) {
		if(err) {
			if(err.code === "ENOENT") {
				fs.mkdirSync(__dirname + "/_download/_temp");
			}
			else if(err.code === "ENOTEMPTY") {
				console.log("Temp folder was not properly cleaned last run. Cleaning now.");
				fs.rmdirSync(__dirname + "/_download/_temp", { recursive: true });
				fs.mkdirSync(__dirname + "/_download/_temp");
			}
			else throw err;
		}

		// Tell us how many files we're going to check
		console.log("Updating " + global.downloads.length + " files.");

		// Start working
		for (var i = 0; i < global.downloads.length; i++) {
			// Make sure we're working in a seperated anonymous space
			(function(i) {
				checkFile(i, global.downloads[i], function(current) { // Check integrity
					updateFile(i, current, void(0), function(current) { // Download updates
						copyFile(i, current, function(current) { // Copy files
							execCmd(i, current, function(current) { // Execute commands
								global.downloads[i] = current;
							});
						});
					});
				});
			})(i);
		}
	});
});

// After everything is done (even if we error out)
process.on('exit', function() { // Asynchronous functions do not work beyond this point
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

	// As long as we didn't leave the download list in an unrecoverable state
    if(global.list !== void(0)) {
		// Save downloadlist
		global.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
			sensitivity: 'base'
		}));
		fs.writeFileSync("../downloadlist.json", stringify(global.list, { space: 4 }) + "\n");

		// Save readme
		fs.writeFileSync("../README.html", createReadme("html"));
		fs.writeFileSync("../README.md", createReadme("md"));
	}

	// Clean the _download/_temp directory
	try {
		try {
			fs.rmdirSync(__dirname + "/_download/_temp");
			return;
		}
		catch (err) {
			if(err.code === "ENOTEMPTY") {
				fs.rmdirSync(__dirname + "/_download/_temp", { recursive: true });
				return;
			}
			else if(err.code === "ENOENT") {
				// Folder has already been deleted somehow
				return;
			}
			else throw err;
		}
	}
	catch (err) {
		console.log("Unable to clean temp folder. Filesystem unresponsive.");
	}

});

}());
