(function() {

// Libraries
var fs = require("fs-extra");
var md5File = require("md5-file");

// Functions
var localizedName = require("../src/localizedName.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current, callback) {
	if (current["folder-override"])
		fs.ensureDirSync("../" + current["folder-override"]);
	console.message(i, "Checking '" + localizedName(i) + "' file integrity.", MESSAGE_VERBOSE);
	if (current.file) {
		md5File("../_download/" + i + "/" + (current["file-override"] ? current["file-override"] : current.file), (err, md5) => {
			if (err) {
				if (err.code === "ENOENT") {
					console.message(i, "WARNING: Skipping file integrity check. '" + localizedName(i) + "' has not yet been downloaded.", MESSAGE_VERBOSE);
					callback(current);
					return; // Nothing to check. Stop.
				} else throw err;
			}
			if (!current.md5)
				throw new Error("ERROR: Missing MD5 for previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
			if (current.md5 !== md5)
				throw new Error("ERROR: MD5 mismatch on previously downloaded file: '" + current.file + "'. Please delete the file and let it redownload.");
			console.message(i, "Successfully checked '" + localizedName(i) + "' file integrity.");
			callback(current);
		});
	} else if (current.url) {
		console.message(i, "WARNING: Skipping file integrity check. '" + localizedName(i) + "' has not yet been downloaded.", MESSAGE_VERBOSE);
		callback(current);
	} else {
		console.message(i, "WARNING: '" + localizedName(i) + "' has no configured file or URL.", MESSAGE_VERBOSE);
		callback(current);
	}
}

})();
