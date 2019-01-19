/**
 * Driver for downloading from atomicstryker.net
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	temp.url = $('a[href*="' + global.config["minecraft-version"] + '"]').first().attr("href");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	updateFile(i, current, temp, callback);
});
