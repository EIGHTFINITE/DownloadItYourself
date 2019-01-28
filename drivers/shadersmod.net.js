/**
 * Driver for downloading from shadersmod.net
 */
(function() {

var $ = cheerio.load(html);
var elem = $("h2.header-version:contains(DOWNLOADS)").nextAll("p").find("a").first();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = elem.attr("href");
updateFile(i, current, temp, callback);
if (!current.name) current.name = "GLSL Shaders Mod";

}());
