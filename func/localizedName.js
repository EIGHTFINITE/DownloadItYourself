(function() {

// Libraries
var is = require('@sindresorhus/is');

module.exports = function(i, skip) {
	if(is.undefined(global.downloads[i]))
		throw new Error("Array index '" + i + "' is out of bounds.");

    if(!is.string(skip)) skip = "";
    if(!skip.includes("name") && global.downloads[i].name) return global.downloads[i].name.toString();
    if(!skip.includes("url") && global.downloads[i].url) return global.downloads[i].url.toString();
    if(!skip.includes("file") && global.downloads[i].file) return global.downloads[i].file.toString();
    return i.toString() + ': "' + JSON.stringify(global.downloads[i]) + '"';
}

})();
