/**
 * Driver for downloading from dedelner.net
 */
(function() {

var $ = cheerio.load(html);
var elem;
if(temp.url.startsWith("https://dedelner.net/download/")) {
	// Download page
	elem = $('a.wpdm-download-link').first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = elem.attr("onclick");
	temp.url = temp.url.substring(temp.url.indexOf("'") + 1, nthIndex(temp.url, "'", 2));
	elem = $("h1.entry-title").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.file = elem.text().trim() + ".zip";
	updateFile(i, current, temp, callback);
}
else {
	// Regular page
	elem = $('a[href^="https://dedelner.net/download/"]').last();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = elem.attr("href");
	updateFile(i, current, temp, callback);
}
if (!current.name) current.name = "KUDA-Shaders";

}());
