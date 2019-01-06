(function() {

function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

module.exports = function(url, file) {
	// Check protocol
	if(!url.startsWith('https://') && !url.startsWith('http://'))
		throw new Error("Unknown protocol.");

	if(typeof file === 'string' && file !== "") {
		// Hardcoded OptiFine URL shortening
		if(url.substring(nthIndex(url, '/', 2) + 1, nthIndex(url, '/', 3)) === "optifine.net")
			url = url.replace(/&x=[0-9a-f]{32}/, "");
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
