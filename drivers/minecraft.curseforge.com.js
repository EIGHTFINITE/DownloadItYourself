/**
 * Driver for downloading from minecraft.curseforge.com
 */
temp.href = current.url + "/files?" + (obj.config["curseforge-version"] ? "filter-game-version=" + obj.config["curseforge-version"] : "");
console.log("[" + i + "] Navigating to: " + temp.href);
request(temp.href, function(err, response, html) {
    if (err) throw err;
    $ = cheerio.load(html);
    temp.protocol = response.request.uri.protocol;
    temp.host = response.request.uri.host;
    temp.path = $("a.overflow-tip.twitch-link").attr('href');
    temp.href = temp.protocol + "//" + temp.host + temp.path;
    console.log("[" + i + "] Navigating to: " + temp.href);
    request(temp.href, function(err, response, html) {
        if (err) throw err;
        $ = cheerio.load(html);
        temp.protocol = response.request.uri.protocol;
        temp.host = response.request.uri.host;
        temp.path = $("a.button.fa-icon-download:not(.alt)").attr('href');
        temp.href = temp.protocol + "//" + temp.host + temp.path;
        temp.file = $("div.info-data.overflow-tip").text().trim();
        console.log("[" + i + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
        request(temp.href).pipe(fs.createWriteStream(obj.config.folder + "/" + temp.file));
    });
});
