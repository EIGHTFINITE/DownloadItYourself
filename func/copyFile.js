(function() {

// Libraries
var fs = require("fs-extra");

// Functions
var localizedName = require("../func/localizedName.js");

// Variables
var MESSAGE_VERBOSE = true;
var CLOSE_THREAD = true;

module.exports = function(i, current, callback) {
	// Check if file exists
	if(!current.file || !fs.existsSync("../_temp/" + i + "/" + current.file)) {
		console.message(i, "WARNING: '" + localizedName(i) + "' is missing its file. Nothing to copy.", MESSAGE_VERBOSE);
		callback(current);
		return;
	}

	// Copy this file to the configured folder
	if (current["folder-override"] !== "") {
		fs.copySync("../_temp/" + i + "/" + current.file, "../" + (current["folder-override"] ? current["folder-override"] : global.config.folder) + "/" + (current["file-override"] ? current["file-override"] : current.file) + (current["file-disabled"] ? ".disabled" : ""));
		console.message(i, "Copied '" + localizedName(i) + "' to '" + (current["folder-override"] ? current["folder-override"] : global.config.folder) + "/'", MESSAGE_VERBOSE);
	}
	// Copy this file to any additional folders
	if (current["additional-folder"]) {
		fs.copySync("../_temp/" + i + "/" + current.file, "../" + current["additional-folder"] + "/" + (current["file-override"] ? current["file-override"] : current.file) + (typeof current["additional-file-disabled"] !== 'undefined' ? (current["additional-file-disabled"] ? ".disabled" : "") : (current["file-disabled"] ? ".disabled" : "")));
		console.message(i, "Copied '" + localizedName(i) + "' to '" + current["additional-folder"] + "/'", MESSAGE_VERBOSE);
	}

	callback(current);
}

})();
