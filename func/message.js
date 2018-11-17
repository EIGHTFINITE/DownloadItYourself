(function() {

// Variables
var numberLength = 0;

// Functions
var registerThread = require("../func/registerThread.js");

// Globals
global.delayedLog = [];
global.threads = [];

function lowestActiveThread() {
	for (var i = 0;; i++) {
		if (global.threads[i] !== false) {
			return i;
		}
	}
	return 0;
}

function pushLateMessages() {
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
		if (delayedMessageThread <= lowestActiveThread()) {
			console.log(global.delayedLog[j]);
			global.delayedLog.splice(j, 1);
			j = -1;
			continue;
		}
	}
}

module.exports = function(i, msg, verbose) {
	if (arguments.length === 0) {
		pushLateMessages();
	}
	if (global.config.verbose || !verbose) {
		if (!global.threads[i] === true) {
			registerThread(i);
		}
		numberLength = global.downloads.length.toString().length;
		msg = "[" + i.toString().padStart(numberLength, "0") + "] " + msg;
		if (global.config["delayed-log"]) {
			// Keep our current message for later
			global.delayedLog.push(msg);
			pushLateMessages();
			return;
		}
		console.log(msg);
	}
}

})();
