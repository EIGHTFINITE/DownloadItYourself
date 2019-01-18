/**
 * Driver for downloading from asie.pl
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	temp.url = response.request.uri.protocol + "//" + response.request.uri.host + "/" + $('a[href*="' + global.config["minecraft-version"] + '"]:not([href$="-deobf.jar"])').last().attr("href");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	updateFile(i, current, temp, callback);
});
