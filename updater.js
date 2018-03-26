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

// Load config and get started
fs.readFile("../downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    // Fill globals
    global.list = JSON.parse(data);
    global.downloads = global.list.downloads;
    global.config = global.list.config;
    // Set up messaging
    console.message = function(msg, i) {
        if (typeof i === "number" && i >= 0) {
            msg = "[" + i.toString().padStart(global.downloads.length.toString().length - 1, "0") + "] " + msg;
            if (global.config["delayed-log"]) {
                delayedLog.push(msg);
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
    var delayedLogCopy = delayedLog.slice();
    delayedLog.sort(function(a, b) {
        var aInt = parseInt(a.substring(1, global.downloads.length.toString().length + 1));
        var bInt = parseInt(b.substring(1, global.downloads.length.toString().length + 1));
        if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
        return aInt - bInt;
    });
    while (delayedLog.length) {
        console.log(delayedLog.shift());
    }
    global.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    if(global.list !== void(0)) fs.writeFileSync("../downloadlist.json", stringify(global.list, { space: 4 }) + "\n");
});

})();
