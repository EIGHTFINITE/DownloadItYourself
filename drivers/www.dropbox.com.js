/**
 * Driver for downloading from web.archive.org
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	// Hardcoded URLs
	if(temp.url === "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAC2dcW--1NoDrBUXCxXEsJGa?dl=0") {
		if(temp.name === "StarMiner") {
			temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AACfH-hd9YV2CIi-LWrqYh4aa/Starminer?dl=0";
			request(temp.url, function(err, response, html) {
				console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
				temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAAznke8T5I5GlNiiazR5-cpa/Starminer/Starminer1710-0.9.9_please_extract_.zip?dl=1";
				temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
				updateFile(i, current, temp, callback);
			});
			return;
		}
	}
	throw new Error("Unreachable");
});
