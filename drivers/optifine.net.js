/**
 * Driver for downloading from optifine.net
 */
(function() {

var $ = cheerio.load(html);
var elem;
if(temp.url.startsWith("https://optifine.net/adloadx")) {
	elem = $("span#Download a").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = "https://" + response.request.uri.host + "/" + elem.attr("href");
	temp.file = elem.text().trim().replace(/^(Download )/, "").trim();
	updateFile(i, current, temp, callback);
}
else {
	var previewBuilds = $("span#preview td.downloadLineFile:contains(" + global.config["minecraft-version"] + ")").nextAll("td.downloadLineMirror").children("a").first();
	if (temp.preview === true && previewBuilds.length)
		temp.url = previewBuilds.attr("href");
	else {
		elem = $("h2:contains(" + global.config["minecraft-version"] + ")").nextAll("table.downloadTable").first().find("td.downloadLineMirror a").first();
		if(!elem.length)
			throw new Error("Couldn't find download link.");
		temp.url = elem.attr("href");
	}
	if (temp.url.startsWith("http://"))
		temp.url = temp.url.replace("http://", "https://");
	updateFile(i, current, temp, callback);
}
if (!current.name) {
	elem = $("h2:contains(" + global.config["minecraft-version"] + ")").next("h3").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	current.name = elem.text().trim();
}
if (!("preview" in current)) current.preview = false;

}());
