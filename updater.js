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

// Variables
var delayedLog = [];

// Load config and get started
fs.readFile("../downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
	// Fill global object
    global.list = JSON.parse(data);
	// Delayed log
    console._log = console.log;
    if (global.list.config["delayed-log"]) {
        console.log = function() {
            if (arguments.length && typeof arguments[0] === "string") {
                if (arguments[0].startsWith("[")) {
                    delayedLog.push(Array.prototype.slice.call(arguments).join(" "));
                    return;
                }
                console._log.apply(this, arguments);
                return;
            }
            console._log.apply(this, arguments);
            return;
        }
    }
	// Start working
    var iPad = "0";
    var current;
    for (var i = 0; i < global.list.downloads.length; i++) {
        iPad = i.toString().padStart(global.list.downloads.length.toString().length, "0");
        current = global.list.downloads[i];
        checkFile(current, i, iPad);
        if (current.url) parseDownload(current, i, iPad);
    }
});

// After everything is done (even if we error out)
process.on('exit', function() {
    var delayedLogCopy = delayedLog.slice();
    delayedLog.sort(function(a, b) {
        var aInt = parseInt(a.substring(1, global.list.downloads.length.toString().length + 1));
        var bInt = parseInt(b.substring(1, global.list.downloads.length.toString().length + 1));
        if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
        return aInt - bInt;
    });
    while (delayedLog.length) {
        console._log(delayedLog.shift());
    }
    global.list.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    if(global.list !== void(0)) fs.writeFileSync("../downloadlist.json", stringify(global.list, { space: 4 }) + "\n");
});

})();
