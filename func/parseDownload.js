(function() {

// Libraries
var fs = require("fs-extra");
var url = require("url");
var cheerio = require("cheerio");
var request = require("request");

// Functions
var downloadFile = require("../func/downloadFile.js");
var localizedName = require("../func/localizedName.js");

module.exports = function(i, current, temp, $) {
    temp = (typeof temp === 'undefined' ? {} : temp);
    fs.readFile("../drivers/" + url.parse(current.url).host + ".js", "utf8", function(err, script) {
        if(global.config.verbose) console.message("Checking '" + localizedName(i) + "' for updates.", i);
        if (err) throw err;
        eval(script); // There must be a better way to do this.
    });
}

})();
