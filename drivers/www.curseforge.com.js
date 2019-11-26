/**
 * Driver for downloading from www.curseforge.com
 */
(function() {

var $ = cheerio.load(html);
var elem;
if((global.config["minecraft-curseforge-version"] && temp.url.includes("/files/all?filter-game-version=")) || (!global.config["minecraft-curseforge-version"] && temp.url.endsWith("/files/all"))) {
	// Files list
	// URL should look like "https://www.curseforge.com/minecraft/mc-mods/projectname/files/all?filter-game-version=1738749986%3A5"
	// We can assume only the correct versions are listed
	elem = $('a[data-action="file-link"]').first();
	if(!elem.length) {
		/* Curseforge doesn't display the files table if the project has only one file.
		// If we can't find anything try grabbing the main file and hope for the best.
		elem = $('article>div.flex.justify-between.items-center.mb-4 a').first();
		if(!elem.length)*/
			throw new Error("Couldn't find download link.");
	}
	temp.url = "https://" + response.request.uri.host + elem.attr("href");
	updateFile(i, current, temp, callback);
}
else if(temp.url.endsWith("/files/all")) {
	// All files list
	// URL should look like "https://www.curseforge.com/minecraft/mc-mods/projectname/files/all"
	// We still need to navigate to correct version listing
	temp.url = temp.url + "?filter-game-version=" + global.config["minecraft-curseforge-version"];
	updateFile(i, current, temp, callback);
}
else if(temp.url.endsWith("/files")) {
	// Files list
	// URL should look like "https://www.curseforge.com/minecraft/mc-mods/projectname/files"
	// We still need to navigate to correct version listing
	temp.url = temp.url + "/all";
	updateFile(i, current, temp, callback);
}
else if(temp.url.includes("/files/")) {
	// File page
	// URL should look like "https://www.curseforge.com/minecraft/mc-mods/projectname/files/0000000"
	// Download link
	elem = $("article a.button.button--hollow").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = "https://" + response.request.uri.host + elem.attr("href");
	// Filename
	elem = $("article>div.flex.justify-between.border-b.border-gray--100.mb-2.pb-4>div>span~*").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.file = elem.text().trim();
	// MD5
	elem = $("article>div.flex.justify-between.border-b.border-gray--100.mb-2.pb-4>div>span~*").eq(6); // Seventh element in the flex table
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.md5 = elem.text().trim();
	if(temp.md5 === current.md5 && fs.existsSync("../_temp/" + i + "/" + current.file)) {
		console.log("'" + localizedName(i) + "' has already been updated to the latest version.");
		callback(current);
	}
	else
		updateFile(i, current, temp, callback);
}
else if(temp.url.includes("/download/")) {
	// Download page
	// URL should look like "https://www.curseforge.com/minecraft/mc-mods/projectname/download/0000000"
	// Download link
	elem = $("p.text-xl[data-countdown-timer]~p.text-sm a").first();
	if(!elem.length)
		throw new Error("Couldn't find download link.");
	temp.url = "https://" + response.request.uri.host + elem.attr("href");
	updateFile(i, current, temp, callback);
}
else {
	// Main project page
	// URL should look like "https://www.curseforge.com/minecraft/mc-mods/projectname"
	if (!current.name) {
		elem = $("h2.font-bold.text-lg.break-all").first();
		if(!elem.length)
			throw new Error("Couldn't find project title.");
		current.name = elem.text().trim();
	}
	if (!current.author) {
		current.author = {};
		elem = $('aside p a[href^="/members/"]').first();
		if(!elem.length)
			throw new Error("Couldn't find project owner.");
		current.author.name = elem.find("span").text().trim();
		current.author.url = "https://" + response.request.uri.host + elem.attr("href");
	}
	if (!current.license) {
		current.license = {};
		elem = $('a[rel="modal:open"]').first();
		if(!elem.length)
			throw new Error("Couldn't find project license.");
		current.license.txt = elem.text().trim();
		current.license.source = temp.source;
	}
	temp.url = temp.url + "/files";
	updateFile(i, current, temp, callback);
}

}());
