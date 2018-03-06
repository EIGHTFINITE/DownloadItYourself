(function() {

var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var request = require("request");
var md5File = require("md5-file");
var obj;

fs.readFile("downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    fs.ensureDirSync(obj.config.folder);
    for (var i = 0; i < obj.downloads.length; i++) {
        checkFile(obj, obj.downloads[i], i, i.toString().padStart(obj.downloads.length.toString().length, "0"));
        parseDownload(obj, obj.downloads[i], i, i.toString().padStart(obj.downloads.length.toString().length, "0"));
    }
});

function checkFile(obj, current, i, iPad) {
    console.log("[" + iPad + "] Checking " + (current.name ? current.name : current.url) + " file integrity.");
    if (current.file) {
        md5File(obj.config.folder + "/" + current.file, (err, md5) => {
            if (err) {
                if (err.code === "ENOENT") {
                    console.log("[" + iPad + '] WARNING: "' + current.file + '" could not be found. Was it deleted?');
                    return; // Nothing to check. Stop.
                } else throw err;
            }
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
    } else {
        console.log("[" + iPad + "] Skipping file integrity check. " + (current.name ? current.name : current.url) + " has not been downloaded yet.");
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
    obj.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    fs.writeFileSync("downloadlist.json", JSON.stringify(obj, null, 4) + "\n");
});

})();
