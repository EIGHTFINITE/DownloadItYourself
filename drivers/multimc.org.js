/**
 * Driver for downloading from multimc.org
 */
(function() {

var $ = cheerio.load(html);
var elem = $("#Download" + (temp.preview ? "Develop" : "") + "~div").first().find(".uk-icon-windows").parent().parent().find("a.uk-button").first();
if(!elem.length)
	throw new Error("Couldn't find download link.");
temp.url = elem.attr("href");
temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
updateFile(i, current, temp, callback);
if (!current.name) current.name = "MultiMC";

}());
