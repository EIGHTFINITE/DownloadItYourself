/**
 * Driver for downloading binary files
 */
(function() {

var filetype = temp.file.substring(temp.file.lastIndexOf("."));
if((filetype !== ".jar") && (filetype !== ".zip") && (filetype !== ".xz") && (filetype !== ".7z") && (filetype !== ".rar"))
	throw new Error("Unknown file type '" + filetype + "'.");

fs.ensureDirSync("../_temp/_download/" + i + "/");
remote.pipe(fs.createWriteStream("../_temp/_download/" + i + "/" + temp.file)).on("finish", function() {
	// Check if downloaded file matches expected MD5
	var downloadMd5 = md5File.sync("../_temp/_download/" + i + "/" + temp.file)
	if (("md5" in temp) && temp.md5 !== downloadMd5) {
		throw new Error("MD5 mismatch for '" + localizedName(i) + "'. Expected '" + temp.md5 + "' got '" + downloadMd5 + "'.");
	}
	fs.ensureDirSync("../_temp/" + i + "/");
	// If our downloaded file matches our previously downloaded file
	if(current.md5 === downloadMd5 && current.file === temp.file && fs.existsSync("../_temp/" + i + "/" + current.file)) {
		console.log("'" + localizedName(i) + "' has already been updated to the latest version.");
	}
	else {
		current.md5 = downloadMd5;
		current.file = temp.file;

		// First, write the file to its home in the _temp folder
		while(true) {
			try {
				fs.copySync("../_temp/_download/" + i + "/" + temp.file, "../_temp/" + i + "/" + temp.file);
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
			fs.unlinkSync("../_temp/_download/" + i + "/" + temp.file);
			break;
		}
		catch (err) {
			console.log("Unable to unlink download. Filesystem unresponsive.");
		}
	}

	callback(current);
});

}());
