(function() {

// Libraries
var fs = require("fs-extra");
var md5File = require("md5-file");

module.exports = function(i, current) {
    if (current["folder-override"]) fs.ensureDirSync(current["folder-override"]);
    console.message("Checking '" + (current.name ? current.name : (current.url ? current.url : (current.file ? current.file : i + ': "' + JSON.stringify(current) + '"'))) + "' file integrity.", i);
    if (current.file) {
        md5File((current["folder-override"] ? "../" + current["folder-override"] : "../" + global.config.folder) + "/" + (current["file-override"] ? current["file-override"] : current.file), (err, md5) => {
            if (err) {
                if (err.code === "ENOENT") {
                    if (!current.url) {
                        console.message("ERROR: '" + (current.name ? current.name : current.file) + "' is missing its file and has no URL to update from.", i);
                        throw new Error("Missing file");
                    }
                    console.message("WARNING: '" + current.file + "' could not be found. Was it deleted?", i);
                    return; // Nothing to check. Stop.
                } else throw err;
            }
            if (!current.url) console.message("WARNING: '" + (current.name ? current.name : current.file) + "' has no URL. It will not be updated.", i);
            if (!current.md5) {
                console.message("Missing MD5 for previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.", i);
                throw new Error("Missing MD5");
            }
            if (current.md5 !== md5) {
                console.message("MD5 mismatch on previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
                throw new Error("MD5 mismatch");
            }
            console.message("Successfully checked '" + (current.name ? current.name : current.url) + "' file integrity.", i);
        });
    } else if (current.url) {
        console.message("Skipping file integrity check. '" + (current.name ? current.name : current.url) + "' has not been downloaded yet.", i);
    } else {
        console.message("ERROR: '" + (current.name ? current.name : (current.url ? current.url : (current.file ? current.file : i + ': "' + JSON.stringify(current) + '"'))) + "' has no configured file or URL.", i);
        throw new Error("Missing file");
    }
}

})();
