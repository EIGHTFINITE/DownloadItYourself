/**
 * Driver for downloading from minecraft.curseforge.com
 */
request(current.url + "/files?" + (obj.config["curseforge-version"] ? "filter-game-version=" + obj.config["curseforge-version"] : ""), function(err, response, html) {
    if (err) throw err;
    $ = cheerio.load(html);
    temp.protocol = response.request.uri.protocol;
    temp.host = response.request.uri.host;
    temp.path = $("a.overflow-tip.twitch-link").attr('href');
    temp.href = temp.protocol + "//" + temp.host + temp.path;
    request(temp.href, function(err, response, html) {
        if (err) throw err;
        $ = cheerio.load(html);
        temp.protocol = response.request.uri.protocol;
        temp.host = response.request.uri.host;
        temp.path = $("a.button.fa-icon-download:not(.alt)").attr('href');
        temp.href = temp.protocol + "//" + temp.host + temp.path;
        temp.file = $("div.info-data.overflow-tip").text().trim();
        request(temp.href).pipe(fs.createWriteStream(obj.config.folder + "/" + temp.file));
    });
});
