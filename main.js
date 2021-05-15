(function() {

// Executable check
if(process.versions.node !== '12.10.0')
	throw Error('EIGHTFINITE-build only supports Node 12.10.0');

// Libraries
var fs = require("fs-extra");
var stringify = require('./node_modules/npm/node_modules/json-stringify-nice');

// Functions
var closeThread = require("./src/closeThread.js");
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
global.args = process.argv.slice(2);
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

		if(!global.args.includes('--readme_only')) {
			var updateSingleFileDaily = !!global.args.includes('--update_single_file_daily');
			if(!updateSingleFileDaily)
				console.log("Updating " + (global.downloads.length+1) + " files."); // Tell us how many files we're going to check
			else {
				var updateSingleFile = Math.floor(new Date()/864e5)%global.downloads.length; // Pick which file we should update. Value increases by one each day until it loops back around
				console.log("Updating file " + (updateSingleFile+1) + " out of " + (global.downloads.length+1) + " files total.");
			}

			// Start working
			for (var i = 0; i < global.downloads.length; i++) {
				(function(i) { // Make sure we're working in a seperated anonymous space
					checkFile(i, global.downloads[i], function(current) { // Check integrity
						if(!updateSingleFileDaily || i === updateSingleFile ) {
							updateFile(i, current, void(0), function(current) { // Download updates
								copyFile(i, current, function(current) { // Copy files
									execCmd(i, current, function(current) { // Execute commands
										global.downloads[i] = current;
									});
								});
							});
						} else {
							closeThread(i);
						}
					});
				})(i);
			}
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
		fs.writeFileSync("../downloadlist.json", stringify(global.list));

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
