/**
 * Driver for downloading from dedelner.net
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	temp.url = $('a[href^="https://dedelner.net/download/"]').last().attr("href");
	request(temp.url, function(err, response, html) {
		console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
		if (err) throw err;
		var $ = cheerio.load(html);
		temp.url = $('a.wpdm-download-link').attr("onclick");
		temp.url = temp.url.substring(temp.url.indexOf("'") + 1, nthIndex(temp.url, "'", 2));
		temp.file = "KUDA-Shaders v6.5.56.zip";
		updateFile(i, current, temp, callback);
	});
	if (!current.name) current.name = "KUDA-Shaders";
});
