(function() {

// Functions
var nthIndex = require("../func/nthIndex.js");

module.exports = function(url, file) {
	// Check protocol
	if(!url.startsWith('https://') && !url.startsWith('http://'))
		throw new Error("Unknown protocol.");
	// Hardcoded Wayback Machine URL shortening
	if(url.substring(nthIndex(url, '/', 2) + 1, nthIndex(url, '/', 3)) === "web.archive.org")
		url = url.replace(/^https?:\/\/web.archive.org\/web\/[0-9]+\//, "");
	// Hardcoded Minecraft Forum URL shortening
	if(url.substring(nthIndex(url, '/', 2) + 1, nthIndex(url, '/', 3)) === "www.minecraftforum.net")
		url = url.replace("/mapping-and-modding-java-edition/minecraft-mods/wip-mods/", "/…/");

	if(typeof file === 'string' && file !== "") {
		// Hardcoded OptiFine URL shortening
		if(url.substring(nthIndex(url, '/', 2) + 1, nthIndex(url, '/', 3)) === "optifine.net")
			url = url.replace(/&x=[0-9a-f]{32}/, "");
		// Hardcoded Dropbox URL shortening
		else if(url.includes("dl.dropboxusercontent.com"))
			url = url.substring(0, nthIndex(url, '/', 2) + 1) + "dl.dropboxusercontent.com/…/file";
		// Omit path if URL ends in a file
		if (url.substring(url.lastIndexOf(".")) === file.substring(file.lastIndexOf(".")))
			url = url.substring(0, nthIndex(url, '/', 3)) + "/…/" + url.substring(url.lastIndexOf("/") + 1);
	}
	// Omit HTTPS protocol
	if(url.startsWith('https://'))
		url = url.substr(8);
	return url;
}

})();
