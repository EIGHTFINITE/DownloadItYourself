/**
 * Driver for downloading binary files
 */
if(!("file" in temp))
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
current.file = temp.file;
remote.pipe(fs.createWriteStream("../_temp" + "/" + temp.file)).on("finish", function() {
	current.md5 = md5File.sync("../_temp" + "/" + temp.file);
	// Check if downloaded file matches expected MD5.
	if (("md5" in temp) && current.md5 !== temp.md5) {
		console.message(i, "ERROR: MD5 mismatch for '" + localizedName(i) + "'. Download failed.");
		throw new Error("MD5 mismatch");
	}
	// Update successful.
	console.message(i, "'" + localizedName(i) + "' has successfully updated." + ("md5" in temp ? " (MD5 matches)" : ""));
	// Copy this file to the configured folder
	if (current["folder-override"]) {
		fs.copySync("../_temp" + "/" + current.file, "../" + current["folder-override"] + "/" + current.file);
		console.message(i, "Copied '" + localizedName(i) + "' to '" + current["folder-override"] + "/'");
	}
	else {
		fs.copySync("../_temp" + "/" + current.file, "../" + global.config.folder + "/" + current.file);
		console.message(i, "Copied '" + localizedName(i) + "' to '" + global.config.folder + "/'");
	}
	// Copy this file to any additional folders
	if (current["additional-folder"]) {
		fs.copySync("../_temp" + "/" + current.file, "../" + current["additional-folder"] + "/" + current.file);
		console.message(i, "Copied '" + localizedName(i) + "' to '" + current["additional-folder"] + "/'");
	}
	closeThread(i);
});
