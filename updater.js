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
        parseDownload(obj, obj.downloads[i], i);
    }
});

function parseDownload(obj, current, i) {
    fs.readFile("drivers/" + url.parse(current.url).host + ".js", "utf8", function(err, script) {
        console.log("[" + i + "] Checking " + (current.name ? current.name : current.url) + " for updates.");
        if (err) throw err;
        var temp = {};
        var $;
        eval(script); // There must be a better way to do this.
    });
}

process.on('exit', function() {
    fs.writeFileSync("downloadlist.json", JSON.stringify(obj, null, 4));
});
