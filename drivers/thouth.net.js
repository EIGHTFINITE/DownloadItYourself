/**
 * Driver for downloading from thouth.net
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	// AdFly URLs have to be hardcoded
	if(temp.url === "http://adf.ly/q37Pu") {
		temp.url = "https://raw.githubusercontent.com/AtomicStryker/github.io/master/files/1.7.10/BattleTowers-1.7.10.zip";
		temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
		updateFile(i, current, temp, callback);
		return;
	}
	throw new Error("Unreachable");
});
