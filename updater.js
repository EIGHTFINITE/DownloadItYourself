(function() {

var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var request = require("request");
var md5File = require("md5-file");
var obj;
var delayedLog = [];

fs.readFile("downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    console._log = console.log;
    if (obj.config["delayed-log"]) {
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
    fs.ensureDirSync(obj.config.folder);
    var iPad = 0;
    var current;
    for (var i = 0; i < obj.downloads.length; i++) {
        iPad = i.toString().padStart(obj.downloads.length.toString().length, "0");
        current = obj.downloads[i];
        checkFile(obj, current, i, iPad);
        if (current.url) parseDownload(obj, current, i, iPad);
    }
});

function checkFile(obj, current, i, iPad) {
    console.log("[" + iPad + "] Checking " + (current.name ? current.name : (current.url ? current.url : (current.file ? current.file : i + ": '" + JSON.stringify(current) + "'"))) + " file integrity.");
    if (current.file) {
        md5File(obj.config.folder + "/" + current.file, (err, md5) => {
            if (err) {
                if (err.code === "ENOENT") {
                    if (!current.url) {
                        console.log("[" + iPad + '] ERROR: "' + (current.name ? current.name : current.file) + '" is missing its file and has no URL to update from.');
                        throw new Error("Missing file");
                    }
                    console.log("[" + iPad + '] WARNING: "' + current.file + '" could not be found. Was it deleted?');
                    return; // Nothing to check. Stop.
                } else throw err;
            }
            if (!current.url) console.log("[" + iPad + '] WARNING: "' + (current.name ? current.name : current.file) + ' has no URL. It will not be updated.');
            if (!current.md5) {
                console.log("[" + iPad + '] Missing MD5 for previously downloaded file: "' + current.file + '". Please delete the file and let it redownload.');
                throw new Error("Missing MD5");
            }
            if (current.md5 !== md5) {
                console.log("[" + iPad + '] MD5 mismatch on previously downloaded file: "' + current.file + '". Please delete the file and let it redownload.');
                throw new Error("MD5 mismatch");
            }
            console.log("[" + iPad + "] Successfully checked " + (current.name ? current.name : current.url) + " file integrity.");
        });
    } else if (current.url) {
        console.log("[" + iPad + "] Skipping file integrity check. " + (current.name ? current.name : current.url) + " has not been downloaded yet.");
    } else {
        console.log("[" + iPad + '] ERROR: "' + (current.name ? current.name : (current.url ? current.url : (current.file ? current.file : i + ": '" + JSON.stringify(current) + "'"))) + '" has no configured file or URL.');
        throw new Error("Missing file");
    }
}

function parseDownload(obj, current, i, iPad, temp, $) {
    temp = (typeof temp === 'undefined' ? {} : temp);
    fs.readFile("drivers/" + url.parse(current.url).host + ".js", "utf8", function(err, script) {
        console.log("[" + iPad + "] Checking " + (current.name ? current.name : current.url) + " for updates.");
        if (err) throw err;
        eval(script); // There must be a better way to do this.
    });
}

process.on('exit', function() {
    var delayedLogCopy = delayedLog.slice();
    delayedLog.sort(function(a, b) {
        var aInt = parseInt(a.substring(1, obj.downloads.length.toString().length + 1));
        var bInt = parseInt(b.substring(1, obj.downloads.length.toString().length + 1));
        if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
        return aInt - bInt;
    });
    while (delayedLog.length) {
        console._log(delayedLog.shift());
    }
    obj.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    fs.writeFileSync("downloadlist.json", JSON.stringify(obj, null, 4) + "\n");
});

})();
