/**
 * Driver for downloading from atomicstryker.net
 */
(function() {

var $ = cheerio.load(html);
var elem = $('td:contains("' + global.config["minecraft-version"] + '")~td a').first();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = elem.attr("href");
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);

}());
