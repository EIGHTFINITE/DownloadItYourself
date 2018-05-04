(function() {

// Libraries
var fs = require("fs-extra");
var md5File = require("md5-file");

// Functions
var localizedName = require("../func/localizedName.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current) {
    if (current["folder-override"]) fs.ensureDirSync("../" + current["folder-override"]);
    console.message("Checking '" + localizedName(i) + "' file integrity.", i, MESSAGE_VERBOSE);
    if (current.file) {
        md5File("../_temp" + "/" + (current["file-override"] ? current["file-override"] : current.file), (err, md5) => {
            if (err) {
                if (err.code === "ENOENT") {
                    if (!current.url) {
                        console.message("WARNING: '" + localizedName(i) + "' is missing its file and has no URL to update from.", i);
                        return; // Nothing to check. Stop.
                    }
                    console.message("WARNING: '" + current.file + "' could not be found. Was it deleted?", i, MESSAGE_VERBOSE);
                    return; // Nothing to check. Stop.
                } else throw err;
            }
            if (!current.url) console.message("WARNING: '" + localizedName(i) + "' has no URL. It will not be updated.", i, MESSAGE_VERBOSE);
            if (!current.md5) {
                console.message("Missing MD5 for previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.", i);
                throw new Error("Missing MD5");
            }
            if (current.md5 !== md5) {
                console.message("MD5 mismatch on previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
                throw new Error("MD5 mismatch");
            }
            console.message("Successfully checked '" + localizedName(i) + "' file integrity.", i);
        });
    } else if (current.url) {
        console.message("Skipping file integrity check. '" + localizedName(i) + "' has not been downloaded yet.", i, MESSAGE_VERBOSE);
    } else {
        console.message("ERROR: '" + localizedName(i) + "' has no configured file or URL.", i);
        throw new Error("Missing file");
    }
}

})();
