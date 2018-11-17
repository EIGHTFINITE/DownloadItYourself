(function() {

// Functions
var registerThread = require("../func/registerThread.js");

// Globals
global.delayedLog = [];
global.finishedThreads = -1;
global.threads = [];

module.exports = function(i, msg, verbose) {
    if (global.config.verbose || !verbose) {
        if (!global.threads[i] === true) {
			registerThread(i);
		}
		var numberLength = global.downloads.length.toString().length;
		msg = "[" + i.toString().padStart(global.downloads.length.toString().length, "0") + "] " + msg;
		if (global.config["delayed-log"]) {
			if (i === global.finishedThreads + 1) {
				// We can push our message right away.
				console.log(msg);
				if (msg.includes("has successfully updated") || msg.includes("is already up to date") || msg.includes("is missing its file and has no URL to update from")) global.finishedThreads++;
			} else {
				// Keep our current message for later
				global.delayedLog.push(msg);
			}
			// Ensure proper ordering
			var delayedLogCopy = global.delayedLog.slice();
			global.delayedLog.sort(function(a, b) {
				var aInt = parseInt(a.substring(1, numberLength + 1));
				var bInt = parseInt(b.substring(1, numberLength + 1));
				if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
				return aInt - bInt;
			});
			// Push late messages
			var delayedMessageThread = 0;
			for (var j = 0; j < global.delayedLog.length; j++) {
				delayedMessageThread = parseInt(global.delayedLog[j].substring(1, numberLength + 1));
				if (delayedMessageThread === global.finishedThreads + 1) {
					console.log(global.delayedLog[j]);
					if (global.delayedLog[j].includes("has successfully updated") || global.delayedLog[j].includes("is already up to date") || global.delayedLog[j].includes("is missing its file and has no URL to update from")) global.finishedThreads++;
					global.delayedLog.splice(j, 1);
					j = -1;
					continue;
				}
				if (delayedMessageThread === global.finishedThreads + 1 && (global.delayedLog[j].includes("has successfully updated") || global.delayedLog[j].includes("is already up to date") || global.delayedLog[j].includes("is missing its file and has no URL to update from"))) {
					global.finishedThreads++;
					j = -1;
					continue;
				}
			}
			return;
		}
	}
    }

})();
