(function() {

// Libraries
var fs = require("fs-extra");
var md5File = require("md5-file");

// Functions
var localizedName = require("../func/localizedName.js");
var closeThread = require("../func/closeThread.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current, callback) {
    if (current["folder-override"]) fs.ensureDirSync("../" + current["folder-override"]);
    console.message(i, "Checking '" + localizedName(i) + "' file integrity.", MESSAGE_VERBOSE);
    if (current.file) {
        md5File("../_temp" + "/" + (current["file-override"] ? current["file-override"] : current.file), (err, md5) => {
            if (err) {
                if (err.code === "ENOENT") {
                    console.message(i, "Skipping file integrity check. '" + localizedName(i) + "' has not yet been downloaded.", MESSAGE_VERBOSE);
                    return; // Nothing to check. Stop.
                } else throw err;
            }
            if (!current.md5) {
                console.message(i, "Missing MD5 for previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
                throw new Error("ERROR: Missing MD5 for '" + current.file + "'");
            }
            if (current.md5 !== md5) {
                console.message(i, "MD5 mismatch on previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
                throw new Error("ERROR: MD5 mismatch on '" + current.file + "'");
            }
            console.message(i, "Successfully checked '" + localizedName(i) + "' file integrity.", MESSAGE_VERBOSE);
			// Depending on what decided to execute first. Close the message thread once we know the file is both up to date and it's integrity has been checked.
			if (typeof global.checks[i] === "object" && global.checks[i].eitherUpToDateOrChecked) closeThread(i);
			else {
				global.checks[i] = {};
				global.checks[i].eitherUpToDateOrChecked = true;
			}
        });
    } else if (current.url) {
        console.message(i, "Skipping file integrity check. '" + localizedName(i) + "' has not yet been downloaded.", MESSAGE_VERBOSE);
    } else {
        console.message(i, "ERROR: '" + localizedName(i) + "' has no configured file or URL.");
        throw new Error("Missing file '" + current.file + "'");
    }
	callback();
}

})();
