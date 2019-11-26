(function() {

// Libraries
var fs = require("fs-extra");
var run = require('child_process').exec;
var path = require('path');

// Functions
var localizedName = require("../func/localizedName.js");

// Variables
var MESSAGE_VERBOSE = true;
var CLOSE_THREAD = true;
var NO_CLOSE_THREAD = false;

module.exports = function(i, current, callback) {
	if(!current.exec) {
		console.message(i, "'" + localizedName(i) + "' has no defined executable commands.", MESSAGE_VERBOSE, global.noExecOrUpdateIsFinished[i] === true ? CLOSE_THREAD : NO_CLOSE_THREAD);
		global.noExecOrUpdateIsFinished[i] = true;
		callback(current);
		return;
	}

	// Copy current into temp
	var temp = Object.assign({}, current);
	var exec = Object.assign({}, current.exec);
	if(!exec.dir) {
		if(current["folder-override"])
			exec.dir = "../" + current["folder-override"];
		else
			exec.dir = "../_temp/" + i;
	}

	// Replace
	if(exec.cmd.includes("___JAVA___"))
		exec.cmd = exec.cmd.replace(/___JAVA___/g, path.resolve(__dirname, '../bin/windows/x64/JRE/jre-8u201-windows-x64/jre1.8.0_201/bin/java.exe'));

	if(exec.args.length > 0) {
		if(exec.args.includes("___7Z___"))
			exec.args = exec.args.replace(/___7Z___/g, path.resolve(__dirname, '../bin/windows/x64/7z/7z.exe'));
		if(exec.args.includes("___FILE___"))
			exec.args = exec.args.replace(/___FILE___/g, temp.file);
		if(exec.args.includes("___SERVER_SETUP___"))
			exec.args = exec.args.replace(/___SERVER_SETUP___/g, path.resolve(__dirname, '../bin/windows/all/scripts/server-setup.bat'));
		if(exec.args.includes("___MULTIMC_SETUP___"))
			exec.args = exec.args.replace(/___MULTIMC_SETUP___/g, path.resolve(__dirname, '../bin/windows/all/scripts/multimc-setup.bat'));
		if(exec.args.includes("___UNPACKER___"))
			exec.args = exec.args.replace(/___UNPACKER___/g, path.resolve(__dirname, '../bin/all/all/library-unpacker/library-unpacker.jar nice.work.forge.LibraryUnpacker --checksums'));
	}

	console.message(i, "Running " + path.parse(exec.cmd).name + " on '" + current.file + "'.");
	// Run command
	run((exec.args.length ? exec.cmd + " " + exec.args : exec.cmd), {cwd: exec.dir}, (err, stdout, stderr) => {
		if (err) throw err;
		console.message(i, path.parse(exec.cmd).name + " succeeded.", MESSAGE_VERBOSE, CLOSE_THREAD);
		callback(current);
	});
}

})();
