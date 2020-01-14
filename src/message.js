(function() {

// Libraries
var is = require('@sindresorhus/is');

// Functions
var registerThread = require("../src/registerThread.js");
var closeThread = require("../src/closeThread.js");

// Variables
var numberLength = 0;

// Globals
global.delayedLog = [];
global.threads = [];
global.closingMsgs = [];

function lowestActiveThread() {
	for (var i = 0;; i++) {
		if (global.threads[i] !== false) {
			return i;
		}
	}
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
	// Write to console
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

module.exports = function(i, msg, verbose, close) {
	if (arguments.length === 0) {
		pushLateMessages();
		return;
	}
	// Register thread when sending to an unopened one
	if (is.undefined(global.threads[i])) {
		registerThread(i);
	}
	numberLength = global.downloads.length.toString().length;
	msg = "[" + i.toString().padStart(numberLength, "0") + "] " + msg;
	// Error out when sending to a closed thread
	if (global.threads[i] === false) {
		pushLateMessages(); // Send any waiting messages to the console before we error out
		throw new Error('Attempting to send message "' + msg + '" to closed thread [' + i + ']. Thread was closed by message "' + global.closingMsgs[i] + '"');
	}
	if (!verbose || global.config.verbose) {
		if (global.config["delayed-log"]) {
			// Keep our current message for later
			global.delayedLog.push(msg);
			pushLateMessages();
		}
		else
			console.log(msg);
	}
	if(close) {
		closeThread(i);
		global.closingMsgs[i] = msg;
	}
}

})();
