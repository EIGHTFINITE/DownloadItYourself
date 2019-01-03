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
	// Create copies of file in the additional folders.
	if (current["additional-folder"]) {
		fs.copySync("../_temp" + "/" + temp.file, "../" + current["additional-folder"] + "/" + temp.file);
		console.message(i, "Copied '" + localizedName(i) + "' to '" + current["additional-folder"] + "/'");
	}
	// Update successful.
	console.message(i, "'" + localizedName(i) + "' has successfully updated." + ("md5" in temp ? " (MD5 matches)" : ""));
	closeThread(i);
});
