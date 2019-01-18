/**
 * Driver for downloading from web.archive.org
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	// Need to know filename in advance
	temp.url = $('a[href*="' + current.file + '"]').first().attr("href").replace(/^https:\/\/web\.archive\.org\/web\/[0-9]+\//, "");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
	updateFile(i, current, temp, callback);
});
