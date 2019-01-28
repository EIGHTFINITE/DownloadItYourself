/**
 * Driver for downloading from asie.pl
 */
(function() {

var $ = cheerio.load(html);
var elem = $('a[href*="' + global.config["minecraft-version"] + '"]:not([href$="-dev.jar"])').last();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = response.request.uri.protocol + "//" + response.request.uri.host + response.request.uri.pathname + elem.attr("href");
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);

}());
