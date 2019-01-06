(function() {

// Libraries
var fs = require("fs-extra");
var run = require('child_process').execFile;

// Functions
var localizedName = require("../func/localizedName.js");
var closeThread = require("../func/closeThread.js");

// Variables
var MESSAGE_VERBOSE = true;

module.exports = function(i, current) {
	if(!current.exec || current.exec.length < 1)
		return;

	// Copy current into temp
	var temp = Object.assign({}, current);
	var exec = Object.assign({}, current.exec);

	// Replace
	if(exec.args.includes("___7Z___"))
		exec.args = exec.args.replace('___7Z___', '..\\bin\\windows\\x64\\7z\\7z.exe');
	if(exec.args.includes("___JAVA___"))
		exec.args = exec.args.replace('___JAVA___', '..\\bin\\windows\\x64\\JRE\\jre-8u152-windows-x64\\jre1.8.0_152\\bin\\java.exe');
	if(exec.args.includes("___FILE___"))
		exec.args = exec.args.replace('___FILE___', temp.file);

	// Split arguments
	if(exec.args && exec.args.length > 0)
		exec.args = exec.args.split(" ");
	else
		exec.args = [];

	// Run
	run(exec.cmd, exec.args, {cwd: exec.dir}, (err, stdout, stderr) => {
		console.message(i, "Running " + exec.cmd + " on '" + localizedName(i) + "'.");
		if (err) throw err;
		closeThread(i);
	});
}

})();
