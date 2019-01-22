/**
 * Driver for downloading from web.archive.org
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if(err) throw err;
	if(response.statusCode !== 200) throw new Error("Page failed to load: " + response.statusCode);
	// Hardcoded forum.minecraftuser.jp URLs
	if(temp.url.includes("forum.minecraftuser.jp")) {
		if(temp.name === "StarMiner" || temp.name === "JointBlock") {
			temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAC2dcW--1NoDrBUXCxXEsJGa?dl=0";
			updateFile(i, current, temp, callback);
			return;
		}
		throw new Error("Unreachable");
	}
	// Hardcoded files.jellysquid.me URLs
	else if(temp.url.includes("files.jellysquid.me")) {
		var $ = cheerio.load(html);
		temp.url = $('a[href*="' + current.file + '"]').first().attr("href");
		if(typeof temp.url !== "string" || !temp.url.length)
			throw new Error("Couldn't find any download links.");
		temp.url = response.request.uri.protocol + "//" + response.request.uri.host + response.request.uri.path.replace(/\/([0-9]+)\//, "/$1if_/") + temp.url;
		temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
		updateFile(i, current, temp, callback);
	}
	else {
		var $ = cheerio.load(html);
		// Need to know filename in advance
		temp.url = $('a[href*="' + current.file + '"]').first().attr("href").replace(/^https:\/\/web\.archive\.org\/web\/[0-9]+\//, "");
		temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
		updateFile(i, current, temp, callback);
	}
});
