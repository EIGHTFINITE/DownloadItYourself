(function() {

// Libraries
var fs = require("fs-extra");
var request = require("request");
var md5File = require("md5-file");

module.exports = function(obj, current, i, iPad, temp) {
    // Override filename
    // Yes, applies to additional folders too. This is intended.
    temp.originalFilename = temp.file;
    if (current["file-override"]) temp.file = current["file-override"];
    // Are we about to download the same file we already have?
    if ((current.md5 ? true : current.md5 === temp.md5) && (current.file === temp.file || current.file === temp.file + ".disabled") && fs.existsSync((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + current.file)) { // Nothing to update.
        console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " is already up to date.");
        if (!current.disabled && current.file.endsWith(".disabled")) {
            temp.file = current.file.substring(0, current.file.length - 9);
            console.log("[" + iPad + "] Enabling " + (current.name ? current.name : current.url) + ".");
            fs.rename((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + current.file, (current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + temp.file, function(err) {
                if (err) throw err;
                current.file = temp.file;
            });
            return; // File has been enabled. Stop.
        }
        if (current.disabled && !current.file.endsWith(".disabled")) {
            temp.file = current.file + ".disabled";
            console.log("[" + iPad + "] Disabling " + (current.name ? current.name : current.url) + ".");
            fs.rename((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + current.file, (current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + temp.file, function(err) {
                if (err) throw err;
                current.file = temp.file;
            });
            return; // File has been disabled. Stop.
        }
        return; // Nothing more to do. Stop.
    }
    // Do we have an outdated file?
    if (current.file && fs.existsSync((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + current.file)) {
        console.log("[" + iPad + '] Deleting outdated file: "' + current.file + '".');
        fs.unlinkSync((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + current.file);
        // Any outdated files in the additional folders?
        if (current.file && fs.existsSync("../" + current["additional-folder"] + "/" + current.file)) {
            console.log("[" + iPad + '] Deleting outdated file: "' + current.file + '".');
            fs.unlinkSync("../" + current["additional-folder"] + "/" + current.file);
        }
    }
    // Should the file be disabled on creation?
    if (current.disabled) temp.file = temp.file + ".disabled";
    // Let's finally download this thing.
    console.log("[" + iPad + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
    fs.ensureDirSync(current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder);
    request(temp.href).pipe(fs.createWriteStream((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + temp.file)).on("finish", function() {
        current.md5 = md5File.sync(this.path);
        // Check if downloaded file matches expected MD5.
        if ("md5" in temp ? current.md5 !== temp.md5 : false) {
            console.log("[" + iPad + "] ERROR: MD5 mismatch for " + (current.name ? current.name : current.url) + ". Download failed.");
            throw new Error("MD5 mismatch");
        }
        // Create copies of file in the additional folders.
        if (current["additional-folder"]) {
            fs.copySync((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + temp.file, "../" + current["additional-folder"] + "/" + temp.file);
            console.log("[" + iPad + "] Copied " + (current.name ? current.name : current.url) + " to '../" + current["additional-folder"] + "'");
        }
        // Update successful.
        console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " has successfully updated." + ("md5" in temp ? " (MD5 matches)" : ""));
        // Update file location.
        current.file = temp.originalFilename + (current.disabled ? ".disabled" : "");
    });
}

})();
