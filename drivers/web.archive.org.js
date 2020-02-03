/**
 * Driver for downloading from web.archive.org
 */
(function() {

var $ = cheerio.load(html);
var elem;
// Hardcoded forum.minecraftuser.jp URLs
if(temp.url.includes("forum.minecraftuser.jp")) {
	if(temp.name === "StarMiner" || temp.name === "JointBlock") {
		temp.url = "https://www.dropbox.com/sh/tvn0t4zofx5vqf5/AAC2dcW--1NoDrBUXCxXEsJGa?dl=0";
		updateFile(i, current, temp, callback);
		return;
	}
	throw new Error("Unreachable");
}
else {
	elem = $('a[href*="' + current.file + '"]').first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	// Need to know filename in advance
	temp.url = elem.attr("href").replace(/^https:\/\/web\.archive\.org\/web\/[0-9]+\//, "");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
	updateFile(i, current, temp, callback);
}

}());
