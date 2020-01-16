(function() {

// Libraries
var is = require('@sindresorhus/is');
var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var md5File = require("md5-file");
var waitUntil = require("wait-until");
var spawn = require("child_process").spawn;

// Functions
var localizedName = require("../src/localizedName.js");
var shortUrl = require("../src/shortUrl.js");
var nthIndex = require("../src/nthIndex.js");

// Variables
var MESSAGE_VERBOSE = true;
var MESSAGE_NOT_VERBOSE = false;
var CLOSE_THREAD = true;
var NO_CLOSE_THREAD = false;

module.exports = function(i, current, temp, callback) {
	var updateFile = module.exports;

	if(!current.url || current.url.startsWith('https://www.curseforge.com/')) { // TODO: Get CurseForge working again
		if(console.message) {
			console.message(i, "'" + localizedName(i) + "' will not be updated automatically.", MESSAGE_NOT_VERBOSE, global.noExecOrUpdateIsFinished[i] === true ? CLOSE_THREAD : NO_CLOSE_THREAD);
			global.noExecOrUpdateIsFinished[i] = true;
		}
		callback(current);
		return;
	}

	// Check protocol
	if(!current.url.startsWith('https://') && !current.url.startsWith('http://'))
		throw new Error("Unknown protocol.");

	// Copy current into temp
	if (is.undefined(temp)) {
		temp = Object.assign({}, current);
		delete temp.file;
		delete temp.md5;
		if(console.message)
			console.message(i, "Checking '" + localizedName(i) + "' for updates.");
		else
			console.log("Checking '" + localizedName(i) + "' for updates.")
	}

	// If we're not already a child process
	if(global.threads) {
		// Wait until the previous files have been updated
		waitUntil(1000, Infinity, function() {
			var counter = 0;
			for(var j = i - 1; j >= 0; j--) {
				if(global.threads[j] !== false) { // If the thread hasn't been closed
					if(current.url.startsWith('https://www.curseforge.com/') && global.downloads[j].url.startsWith('https://www.curseforge.com/')) // Never have more than one opened CurseForge thread
						return false;
					counter++; // Then increase the counter
					if(counter >= global.config["max-active-downloads"]) // If too many threads are still open
						return false; // Then keep waiting
				}
			}
			return true;
		}, function() {
			// Slow down CurseForge requests
			if(current.url.startsWith('https://www.curseforge.com/')) {
				setTimeout(function () {
					spawnChild();
				}, 5000);
			}
			else {
				spawnChild();
			}
		});
	}
	else {
		// Slow down CurseForge requests
		if(current.url.startsWith('https://www.curseforge.com/')) {
			setTimeout(function () {
				spawnChild();
			}, 3000);
		}
		else {
			// Otherwise create a child immediately
			spawnChild();
		}
	}

	// Spawn child process
	function spawnChild() {
		var child = spawn(process.execPath, ["--use_strict", "--no-warnings", __dirname + "/updateFileChild.js", JSON.stringify(i), JSON.stringify(current), JSON.stringify(temp)]);

		child.on('exit', function(code){
			clearTimeout(to);
			if(code === 256) {
				if(console.message)
					console.message(i, "Child process finished successfully.", MESSAGE_VERBOSE);
				callback(current);
				return;
			}
			if(console.message)
				console.message(i, "Child process failed with error code " + code + ". Retrying…");
			else
				console.log("Child process failed with error code " + code + ". Retrying…");
			spawnChild();
		});

		child.stdout.on('data', function (data) {
			// Split text if we recieved more than one message
			var dataSplit = String(data).trim().match(/[^\r\n]+/g);
			var dataCurrent;
			// Process messages
			for(var j = 0; j < dataSplit.length; j++) {
				dataCurrent = dataSplit[j].trim();
				if(dataCurrent.startsWith('VariableAlteration$current:')) {
					// Merge the variables
					current = {...current, ...JSON.parse(dataCurrent.substring(27))};
				}
				else if(console.message) {
					if(dataCurrent.startsWith("'" + localizedName(i) + "' has successfully updated.") || dataCurrent.startsWith("'" + localizedName(i) + "' has already been updated to the latest version.")) {
						console.message(i, dataCurrent, MESSAGE_NOT_VERBOSE, global.noExecOrUpdateIsFinished[i] === true ? CLOSE_THREAD : NO_CLOSE_THREAD);
						global.noExecOrUpdateIsFinished[i] = true;
					}
					else
						console.message(i, dataCurrent);
				}
				else
					console.log(dataCurrent);
			}
		});

		child.stderr.on('data', function (data) {
			if(console.message)
				console.message(i, "Child process failed with error:\r\n " + data);
			else
				throw new Error("Error on thread " + i + ":\r\n" + data);
		});

		var to = setTimeout(function(){
			child.kill();
			if(console.message)
				console.message(i, "Child process timed out. Retrying…");
			else
				console.log("Child process timed out. Retrying…");
			spawnChild();
		}, 600000);
	}
}

})();
