/**
 * Driver for downloading from minecraft.curseforge.com
 */
(function() {

var $ = cheerio.load(html);
var elem;
if(temp.url.includes("/files?")) {
	// Files list
	elem = $("a.overflow-tip.twitch-link");
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = response.request.uri.protocol + "//" + response.request.uri.host + elem.attr("href");
	updateFile(i, current, temp, callback);
}
else if(temp.url.includes("/files/")) {
	// File page
	// Download link
	elem = $("a.button.fa-icon-download:not(.alt)").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = response.request.uri.protocol + "//" + response.request.uri.host + elem.attr("href");
	// Filename
	elem = $("div.info-data.overflow-tip").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.file = elem.text().trim();
	// MD5
	elem = $("span.md5").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.md5 = elem.text().trim();
	updateFile(i, current, temp, callback);
}
else {
	// Project page
	temp.url = temp.url + "/files?" + (global.config["minecraft-curseforge-version"] ? "filter-game-version=" + global.config["minecraft-curseforge-version"] : "");
	updateFile(i, current, temp, callback);
}
if (!current.name) {
	elem = $("h1.project-title").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	current.name = elem.text().trim();
}

}());
