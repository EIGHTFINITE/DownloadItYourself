/**
 * Driver for downloading from github.com
 */
(function() {

var $ = cheerio.load(html);
var elem = $('p:contains("1.7.10") a').first();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = elem.attr("href");
// Bitly URLs have to be hardcoded
if(temp.url === "http://bit.ly/2joJYhm") {
	console.log("Navigating to '" + shortUrl(temp.url) + "'.");
	temp.url = "https://www.dropbox.com/s/l1tvmqyjg337h95/JoypadMod-1.7.10-10.13.4.1614-1.7.10.jar?dl=0";
}
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);

}());
