/**
 * Driver for downloading from shadersmod.com
 */
(function() {

var $ = cheerio.load(html);
var elem = $("h2.header-version:contains(DOWNLOADS)").nextAll("p").find("a").first();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = elem.attr("href");
// Shrinkearn URLs have to be hardcoded
if(temp.url === "http://shrinkearn.com/k3PQ") {
	console.log("Navigating to '" + shortUrl(temp.url) + "'.");
	temp.url = "http://www.karyonix.net/shadersmod/files/ShadersModCore-v2.3.31-mc1.7.10-f.jar";
}
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);
if (!current.name) current.name = "GLSL Shaders Mod";

}());
