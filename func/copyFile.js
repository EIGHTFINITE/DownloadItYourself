(function() {

// Libraries
var fs = require("fs-extra");

// Functions
var localizedName = require("../func/localizedName.js");
var closeThread = require("../func/closeThread.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current) {
	// Check if file exists
	if(!current.file || !fs.existsSync("../_temp" + "/" + current.file, "../" + (current["folder-override"] ? current["folder-override"] : global.config.folder) + "/" + current.file)) {
		console.message(i, "WARNING: '" + localizedName(i) + "' is missing its file.");
		return;
	}

	// Copy this file to the configured folder
	fs.copySync("../_temp" + "/" + current.file, "../" + (current["folder-override"] ? current["folder-override"] : global.config.folder) + "/" + current.file);
	console.message(i, "Copied '" + localizedName(i) + "' to '" + (current["folder-override"] ? current["folder-override"] : global.config.folder) + "/'");
	// Copy this file to any additional folders
	if (current["additional-folder"]) {
		fs.copySync("../_temp" + "/" + current.file, "../" + current["additional-folder"] + "/" + current.file);
		console.message(i, "Copied '" + localizedName(i) + "' to '" + current["additional-folder"] + "/'");
	}
	closeThread(i);
}

})();
