/**
 * Driver for downloading from atomicstryker.net
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	temp.url = $('td:contains("' + global.config["minecraft-version"] + '")~td a').attr("href");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	updateFile(i, current, temp, callback);
});
