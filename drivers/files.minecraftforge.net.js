/**
 * Driver for downloading from files.minecraftforge.net
 */
if (temp.url.startsWith("http://"))
	temp.url = temp.url.replace("http://", "https://");
if (current.url.startsWith("http://"))
	current.url = current.url.replace("http://", "https://");
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	if (err) throw err;
	var $ = cheerio.load(html);
	if($(".logo-image").length) {
		// Regular page
		temp.url = response.request.uri.protocol + "//" + response.request.uri.host + $(".download-list " + (temp.preview === true ? ".promo-latest" : ".promo-recommended")).parent().parent().find('a.info-link[href$="-' + (temp.name.includes("Installer") ? "installer" : "universal") + '.jar"]').attr("href");
		temp.md5 = $(".download-list " + (temp.preview === true ? ".promo-latest" : ".promo-recommended")).parent().parent().find('a.info-link[href$="-' + (temp.name.includes("Installer") ? "installer" : "universal") + '.jar"]~div').text().trim().substr(4).trim();
		temp.md5 = temp.md5.substring(0, temp.md5.indexOf('\n'));
		temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	} else {
		// Basic page
		temp.url = $('a[href*="' + (temp.preview === true ? global.config["minecraft-version"] : (function(){throw new Error("Unimplemented")}())) + '"]:not([href$="-dev.jar"]):not([href$="-src.jar"])').first().attr("href");
		temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	}
	if (temp.url.startsWith("http://"))
		temp.url = temp.url.replace("http://", "https://");
	updateFile(i, current, temp, callback);
	if (!("preview" in current)) current.preview = false;
});
