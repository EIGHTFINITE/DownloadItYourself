/**
 * Driver for downloading from files.minecraftforge.net
 */
(function() {

var $ = cheerio.load(html);
var elem;
if($(".logo-image").length) {
	// Normal page
	// Example: https://files.minecraftforge.net/maven/net/minecraftforge/forge/index_1.7.10.html
	elem = $(".download-list " + (temp.preview === true ? ".promo-latest" : ".promo-recommended")).parent().parent().find('a[href$="-' + (temp.name.includes("Installer") ? "installer" : "universal") + '.jar"]:not([href^="https://"])').first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = response.request.uri.protocol + "//" + response.request.uri.host + elem.attr("href");
	temp.md5 = $(".download-list " + (temp.preview === true ? ".promo-latest" : ".promo-recommended")).parent().parent().find('a[href$="-' + (temp.name.includes("Installer") ? "installer" : "universal") + '.jar"]~div').text().trim().substr(4).trim().substr(0,32);
} else {
	// Basic page
	// Example: https://files.minecraftforge.net/CodeChickenLib/
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
