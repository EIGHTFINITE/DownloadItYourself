/**
 * Driver for downloading binary files
 */
(function() {

var filetype = temp.file.substring(temp.file.lastIndexOf("."));
if((filetype !== ".jar") && (filetype !== ".zip") && (filetype !== ".xz") && (filetype !== ".7z") && (filetype !== ".rar"))
	throw new Error("Unknown file type '" + filetype + "'.");

// Create directory
if (!fs.existsSync("../_download/_temp/" + current.id + "/")) {
	fs.mkdirSync("../_download/_temp/" + current.id + "/");
}
remote.pipe(fs.createWriteStream("../_download/_temp/" + current.id + "/" + temp.file)).on("finish", function() {
	// Check if downloaded file matches expected MD5
	if (!fs.existsSync("../_download/" + current.id + "/")) {
		fs.mkdirSync("../_download/" + current.id + "/");
	}
	// If our downloaded file matches our previously downloaded file
	if(current.file === temp.file && fs.existsSync("../_download/" + current.id + "/" + current.file)) {
		console.log("'" + localizedName(i) + "' has already been updated to the latest version.");
	}
	else {
		current.file = temp.file;

		// First, write the file to its home in the _download folder
		while(true) {
			try {
				fs.copySync("../_download/_temp/" + current.id + "/" + temp.file, "../_download/" + current.id + "/" + temp.file);
				break;
			}
			catch (err) {
				console.log("Unable to write file. Filesystem unresponsive.");
			}
		}

		// Update successful
		console.log("'" + localizedName(i) + "' has successfully updated." + ("md5" in temp ? " (MD5 matches)" : ""));
	}

	// Then, delete the copy we got from the web
	while(true) {
		try {
			fs.unlinkSync("../_download/_temp/" + current.id + "/" + temp.file);
			break;
		}
		catch (err) {
			console.log("Unable to unlink download. Filesystem unresponsive.");
		}
	}

	callback(current);
});

}());
