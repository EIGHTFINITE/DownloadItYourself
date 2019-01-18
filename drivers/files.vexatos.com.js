/**
 * Driver for downloading from files.vexatos.com
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	temp.url = response.request.uri.protocol + "//" + response.request.uri.host + "/" + $('a[href*="' + global.config["minecraft-version"] + '"]:not([href$="-api.jar"]):not([href$="-deobf.jar"])').last().attr("href");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	updateFile(i, current, temp, callback);
});
