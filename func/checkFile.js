(function() {

// Libraries
var fs = require("fs-extra");
var md5File = require("md5-file");

module.exports = function(obj, current, i, iPad) {
    if (current["folder-override"]) fs.ensureDirSync(current["folder-override"]);
    console.log("[" + iPad + "] Checking " + (current.name ? current.name : (current.url ? current.url : (current.file ? current.file : i + ": '" + JSON.stringify(current) + "'"))) + " file integrity.");
    if (current.file) {
        md5File((current["folder-override"] ? "../" + current["folder-override"] : "../" + obj.config.folder) + "/" + (current["file-override"] ? current["file-override"] : current.file), (err, md5) => {
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

})();
