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
var downloadFile =  require("./func/downloadFile.js");

// Globals
global.list = void(0);
global.downloads = void(0);
global.config = void(0);

// Variables
var delayedLog = [];
var finishedThreads = -1;

// Load config and get started
fs.readFile("../downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    // Fill globals
    global.list = JSON.parse(data);
    global.downloads = global.list.downloads;
    global.config = global.list.config;
    // Set up messaging
    console.message = function(msg, i) {
        if (typeof i === "number") {
            var numberLength = global.downloads.length.toString().length;
            msg = "[" + i.toString().padStart(global.downloads.length.toString().length, "0") + "] " + msg;
            if (global.config["delayed-log"]) {
                if (i === finishedThreads + 1) {
					// We can push our message right away.
                    console.log(msg);
                    if (msg.includes("has successfully updated") || msg.includes("is already up to date") || msg.includes("is missing its file and has no URL to update from")) finishedThreads++;
                } else {
                    // Keep our current message for later
                    delayedLog.push(msg);
                }
                // Ensure proper ordering
                var delayedLogCopy = delayedLog.slice();
                delayedLog.sort(function(a, b) {
                    var aInt = parseInt(a.substring(1, numberLength + 1));
                    var bInt = parseInt(b.substring(1, numberLength + 1));
                    if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
                    return aInt - bInt;
                });
                // Push late messages
				var delayedMessageThread = 0;
                for (var j = 0; j < delayedLog.length; j++) {
					delayedMessageThread = parseInt(delayedLog[j].substring(1, numberLength + 1));
                    if (delayedMessageThread === finishedThreads + 1) {
						console.log(delayedLog[j]);
						if (delayedLog[j].includes("has successfully updated") || delayedLog[j].includes("is already up to date") || delayedLog[j].includes("is missing its file and has no URL to update from")) finishedThreads++;
                        delayedLog.splice(j, 1);
                        j = -1;
						continue;
                    }
                    if (delayedMessageThread === finishedThreads + 1 && (delayedLog[j].includes("has successfully updated") || delayedLog[j].includes("is already up to date") || delayedLog[j].includes("is missing its file and has no URL to update from"))) {
						finishedThreads++;
						j = -1;
						continue;
					}
                }
                return;
            }
        }
        console.log(msg);
    }
    // Start working
    var current;
    for (var i = 0; i < global.downloads.length; i++) {
        current = global.downloads[i];
        checkFile(i, current);
        if (current.url) parseDownload(i, current);
    }
});

// After everything is done (even if we error out)
process.on('exit', function() {
	// Process leftover messages
	if (global.config["delayed-log"] && delayedLog.length) {
		console.log("WARNING: Not all messages were pushed to the console. Appending messages now.");
		var delayedLogCopy = delayedLog.slice();
		var numberLength = global.downloads.length.toString().length;
		delayedLog.sort(function(a, b) {
			var aInt = parseInt(a.substring(1, numberLength + 1));
			var bInt = parseInt(b.substring(1, numberLength + 1));
			if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
			return aInt - bInt;
		});
		while (delayedLog.length) {
			console.log(delayedLog.shift());
		}
	}
	// Save downloadlist
    global.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    if(global.list !== void(0)) fs.writeFileSync("../downloadlist.json", stringify(global.list, { space: 4 }) + "\n");
});

})();
