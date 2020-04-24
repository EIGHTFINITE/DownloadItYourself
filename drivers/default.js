/**
 * Driver for downloading binary files
 */
(function() {

var filetype = temp.file.substring(temp.file.lastIndexOf("."));
if((filetype !== ".jar") && (filetype !== ".zip") && (filetype !== ".xz") && (filetype !== ".7z") && (filetype !== ".rar"))
	throw new Error("Unknown file type '" + filetype + "'.");

fs.ensureDirSync("../_download/_temp/" + current.id + "/");
remote.pipe(fs.createWriteStream("../_download/_temp/" + current.id + "/" + temp.file)).on("finish", function() {
	// Check if downloaded file matches expected MD5
	var downloadMd5 = md5File.sync("../_download/_temp/" + current.id + "/" + temp.file)
	if (("md5" in temp) && temp.md5 !== downloadMd5) {
		throw new Error("MD5 mismatch for '" + localizedName(i) + "'. Expected '" + temp.md5 + "' got '" + downloadMd5 + "'.");
	}
	fs.ensureDirSync("../_download/" + current.id + "/");
	// If our downloaded file matches our previously downloaded file
	if(current.md5 === downloadMd5 && current.file === temp.file && fs.existsSync("../_download/" + current.id + "/" + current.file)) {
		console.log("'" + localizedName(i) + "' has already been updated to the latest version.");
	}
	else {
		current.md5 = downloadMd5;
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
