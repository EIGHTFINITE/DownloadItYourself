/**
 * Driver for downloading from shadersmod.net
 */
request(temp.url, function(err, response, html) {
    console.message(i, "Navigating to: '" + temp.url + "'.", MESSAGE_VERBOSE);
    if (err) throw err;
    var $ = cheerio.load(html);
    temp.url = $("h2.header-version:contains(DOWNLOADS)").nextAll("p").find("a").attr("href");
	if(temp.url.includes('shrinkearn.com'))
		temp.url = 'http://www.karyonix.net/shadersmod/files/ShadersModCore-v2.3.31-mc1.7.10-f.jar';
    updateFile(i, current, temp);
    if (!current.name) current.name = "Shaders Mod";
});
