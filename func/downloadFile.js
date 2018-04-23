(function() {

// Libraries
var fs = require("fs-extra");
var request = require("request");
var md5File = require("md5-file");

// Functions
var localizedName = require("../func/localizedName.js");

module.exports = function(i, current, temp) {
    // Override filename
    // Yes, applies to additional folders too. This is intended.
    temp.originalFilename = temp.file;
    if (current["file-override"]) temp.file = current["file-override"];
    // Are we about to download the same file we already have?
    if ((current.md5 ? true : current.md5 === temp.md5) && (current.file === temp.file || current.file === temp.file + ".disabled") && fs.existsSync("../_temp" + "/" + current.file)) { // Nothing to update.
        console.message("'" + localizedName(i) + "' is already up to date.", i);
        if (!current.disabled && current.file.endsWith(".disabled")) {
            temp.file = current.file.substring(0, current.file.length - 9);
            console.message("Enabling '" + localizedName(i) + "'.", i);
            fs.rename("../_temp" + "/" + current.file, "../_temp" + "/" + temp.file, function(err) {
                if (err) throw err;
                current.file = temp.file;
            });
            return; // File has been enabled. Stop.
        }
        if (current.disabled && !current.file.endsWith(".disabled")) {
            temp.file = current.file + ".disabled";
            console.message("Disabling '" + localizedName(i) + "'.", i);
            fs.rename("../_temp" + "/" + current.file, "../_temp" + "/" + temp.file, function(err) {
                if (err) throw err;
                current.file = temp.file;
            });
            return; // File has been disabled. Stop.
        }
        return; // Nothing more to do. Stop.
    }
    // Do we have an outdated file?
    if (current.file && fs.existsSync("../_temp" + "/" + current.file)) {
        console.message("Deleting outdated file: '" + current.file + "'.", i);
        fs.unlinkSync("../_temp" + "/" + current.file);
        // Any outdated files in the additional folders?
        if (current.file && fs.existsSync("../" + current["additional-folder"] + "/" + current.file)) {
            console.message("Deleting outdated file: '" + current.file + "'.", i);
            fs.unlinkSync("../" + current["additional-folder"] + "/" + current.file);
        }
    }
    // Should the file be disabled on creation?
    if (current.disabled) temp.file = temp.file + ".disabled";
    // Let's finally download this thing.
    console.message("Downloading: '" + temp.href + "' as '" + temp.file + "'.", i);
    request(temp.href).pipe(fs.createWriteStream("../_temp" + "/" + temp.file)).on("finish", function() {
        current.md5 = md5File.sync(this.path);
        // Check if downloaded file matches expected MD5.
        if ("md5" in temp ? current.md5 !== temp.md5 : false) {
            console.message("ERROR: MD5 mismatch for '" + localizedName(i) + "'. Download failed.", i);
            throw new Error("MD5 mismatch");
        }
        // Create copies of file in the additional folders.
        if (current["additional-folder"]) {
            fs.copySync("../_temp" + "/" + temp.file, "../" + current["additional-folder"] + "/" + temp.file);
            console.message("Copied '" + localizedName(i) + "' to '" + current["additional-folder"] + "/'", i);
        }
        // Update successful.
        console.message("'" + localizedName(i) + "' has successfully updated." + ("md5" in temp ? " (MD5 matches)" : ""), i);
        // Update file location.
        current.file = temp.originalFilename + (current.disabled ? ".disabled" : "");
    });
}

})();
