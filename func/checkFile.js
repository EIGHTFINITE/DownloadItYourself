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
                    if (!current.url) {
                        console.message(i, "WARNING: '" + localizedName(i) + "' is missing its file and has no URL to update from.");
						closeThread(i);
                        return; // Nothing to check. Stop.
                    }
                    console.message(i, "WARNING: '" + current.file + "' could not be found. Was it deleted?", MESSAGE_VERBOSE);
                    return; // Nothing to check. Stop.
                } else throw err;
            }
            if (!current.url) console.message(i, "WARNING: '" + localizedName(i) + "' has no URL. It will not be updated.", MESSAGE_VERBOSE);
            if (!current.md5) {
                console.message(i, "Missing MD5 for previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
                throw new Error("Missing MD5");
            }
            if (current.md5 !== md5) {
                console.message(i, "MD5 mismatch on previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
                throw new Error("MD5 mismatch");
            }
            console.message(i, "Successfully checked '" + localizedName(i) + "' file integrity.");
			// Depending on what decided to execute first. Close the message thread once we know the file is both up to date and it's integrity has been checked.
			if (typeof global.checks[i] === "object" && global.checks[i].eitherUpToDateOrChecked) closeThread(i);
			else {
				global.checks[i] = {};
				global.checks[i].eitherUpToDateOrChecked = true;
			}
        });
    } else if (current.url) {
        console.message(i, "Skipping file integrity check. '" + localizedName(i) + "' has not been downloaded yet.", MESSAGE_VERBOSE);
    } else {
        console.message(i, "ERROR: '" + localizedName(i) + "' has no configured file or URL.");
        throw new Error("Missing file");
    }
	callback();
}

})();
