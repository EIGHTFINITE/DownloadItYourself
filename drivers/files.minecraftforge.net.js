/**
 * Driver for downloading from files.minecraftforge.net
 */
(function() {

var $ = cheerio.load(html);
var elem;
if($(".logo-image").length) {
	// Regular page
	elem = $(".download-list " + (temp.preview === true ? ".promo-latest" : ".promo-recommended")).parent().parent().find('a.info-link[href$="-' + (temp.name.includes("Installer") ? "installer" : "universal") + '.jar"]').first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = response.request.uri.protocol + "//" + response.request.uri.host + elem.attr("href");
	temp.md5 = $(".download-list " + (temp.preview === true ? ".promo-latest" : ".promo-recommended")).parent().parent().find('a.info-link[href$="-' + (temp.name.includes("Installer") ? "installer" : "universal") + '.jar"]~div').text().trim().substr(4).trim();
	temp.md5 = temp.md5.substring(0, temp.md5.indexOf('\n'));
} else {
	// Basic page
	elem = $('a[href*="' + (temp.preview === true ? global.config["minecraft-version"] : (function(){throw new Error("Unimplemented")}())) + '"]:not([href$="-dev.jar"]):not([href$="-src.jar"])').first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = elem.attr("href");
}
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
if (temp.url.startsWith("http://"))
	temp.url = temp.url.replace("http://", "https://");
updateFile(i, current, temp, callback);
if (!("preview" in current)) current.preview = false;

}());
