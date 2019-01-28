/**
 * Driver for downloading from files.vexatos.com
 */
(function() {

var $ = cheerio.load(html);
var elem = $('a[href*="' + global.config["minecraft-version"] + '"]:not([href$="-api.jar"]):not([href$="-deobf.jar"])').last();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = response.request.uri.protocol + "//" + response.request.uri.host + "/" + elem.attr("href");
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);

}());
