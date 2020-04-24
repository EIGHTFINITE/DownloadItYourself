/**
 * Driver for downloading from atomicstryker.net
 */
(function() {

var $ = cheerio.load(html);
var elem = $('td:contains("' + global.config["minecraft-version"] + '")~td a').first();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = elem.attr("href");
// AdFly URLs have to be hardcoded
if(temp.url === "http://adf.ly/q37Pu") {
	console.log("Navigating to '" + shortUrl(temp.url) + "'.");
	temp.url = "https://raw.githubusercontent.com/AtomicStryker/github.io/master/files/1.7.10/BattleTowers-1.7.10.zip";
}
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);

}());
