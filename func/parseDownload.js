(function() {

// Libraries
var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var request = require("request");

// Functions
var downloadFile = require("../func/downloadFile.js");

module.exports = function(i, current, temp, $) {
    temp = (typeof temp === 'undefined' ? {} : temp);
    fs.readFile("../drivers/" + url.parse(current.url).host + ".js", "utf8", function(err, script) {
        console.message("Checking " + (current.name ? current.name : current.url) + " for updates.", i);
        if (err) throw err;
        eval(script); // There must be a better way to do this.
    });
}

})();
