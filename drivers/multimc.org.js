/**
 * Driver for downloading from files.minecraftforge.net
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to: '" + temp.url + "'.", MESSAGE_VERBOSE);
	if (err) throw err;
	var $ = cheerio.load(html);
	temp.url = $("#Download" + (temp.preview ? "Develop" : "") + "~div").first().find(".uk-icon-windows").parent().parent().find("a.uk-button").attr("href");
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1);
	updateFile(i, current, temp, callback);
	if (!current.name) current.name = "MultiMC";
	if (!("preview" in current)) current.preview = false;
});
