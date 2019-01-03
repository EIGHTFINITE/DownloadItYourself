/**
 * Driver for downloading from minecraft.curseforge.com
 */
temp.url = temp.url + "/files?" + (global.config["curseforge-version"] ? "filter-game-version=" + global.config["curseforge-version"] : "");
request(temp.url, function(err, response, html) {
    console.message(i, "Navigating to: '" + temp.url + "'.", MESSAGE_VERBOSE);
    if (err) throw err;
    var $ = cheerio.load(html);
    temp.url = response.request.uri.protocol + "//" + response.request.uri.host + $("a.overflow-tip.twitch-link").attr("href");
    request(temp.url, function(err, response, html) {
        console.message(i, "Navigating to: '" + temp.url + "'.", MESSAGE_VERBOSE);
        if (err) throw err;
        $ = cheerio.load(html);
        temp.md5 = $("span.md5").text().trim();
        temp.file = $("div.info-data.overflow-tip").text().trim();
        temp.url = response.request.uri.protocol + "//" + response.request.uri.host + $("a.button.fa-icon-download:not(.alt)").attr("href");
        updateFile(i, current, temp);
    });
    if (!current.name) current.name = $("h1.project-title").text().trim();
});
