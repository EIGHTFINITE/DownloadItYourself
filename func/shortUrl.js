(function() {

// Functions
var nthIndex = require("../func/nthIndex.js");

module.exports = function(url, file) {
	// Check protocol
	if(!url.startsWith('https://') && !url.startsWith('http://'))
		throw new Error("Unknown protocol.");

	// CurseForge URL shortening
	if(url.substring(nthIndex(url, '/', 2) + 1, nthIndex(url, '/', 3)) === "www.curseforge.com" && global.config["minecraft-curseforge-version"])
		url = url.replace("?filter-game-version=" + global.config["minecraft-curseforge-version"], "?filter-game-version");

	// Minecraft Forum URL shortening
	if(url.includes("https://www.minecraftforum.net"))
		url = url.replace("https://www.minecraftforum.net", "minecraftforum.net");
	if(url.includes("/mapping-and-modding-java-edition/minecraft-mods/wip-mods/"))
		url = url.replace("/mapping-and-modding-java-edition/minecraft-mods/wip-mods/", "/…/");

	if(typeof file === 'string' && file !== "") {
		// OptiFine URL shortening
		if(url.substring(nthIndex(url, '/', 2) + 1, nthIndex(url, '/', 3)) === "optifine.net")
			url = url.replace(/&x=[0-9a-f]{32}/, "");
		// Dropbox URL shortening
		else if(url.includes("dl.dropboxusercontent.com"))
			url = "dl.dropboxusercontent.com/…/file";
		// Omit path if URL ends in the file
		if (url.substring(url.lastIndexOf(".")) === file.substring(file.lastIndexOf(".")))
			url = url.substring(0, nthIndex(url, '/', 3)) + "/…/" + url.substring(url.lastIndexOf("/") + 1);
	}

	// Omit HTTPS protocol
	if(url.startsWith('https://'))
		url = url.substr(8);
	else if(url.startsWith('http://'))
		url = url.substr(7);

	// Omit WWW notation
	if(url.startsWith('www.'))
		url = url.substr(4);
	// Omit empty anchor
	if(url.substr(-1) === '#')
		url = url.slice(0, -1);
	return url;
}

})();
