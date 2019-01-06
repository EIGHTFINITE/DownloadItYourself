/**
 * Driver for downloading from optifine.net
 */
request(temp.url, function(err, response, html) {
    console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
    if (err) throw err;
    var $ = cheerio.load(html);
    var previewBuilds = $("span#preview td.downloadLineFile:contains(" + global.config["minecraft-version"] + ")").nextAll("td.downloadLineMirror").children("a");
    if (temp.preview === true && previewBuilds.length > 0) temp.url = previewBuilds.attr("href");
    else temp.url = $("h2:contains(" + global.config["minecraft-version"] + ")").nextAll("table.downloadTable").first().find("td.downloadLineMirror a").attr("href");
    request(temp.url, function(err, response, html) {
        console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
        if (err) throw err;
        $ = cheerio.load(html);
        temp.file = $("span#Download a").text().trim().replace(/^(Download )/, "").trim();
        temp.url = response.request.uri.protocol + "//" + response.request.uri.host + "/" + $("span#Download a").attr("href");
        updateFile(i, current, temp, callback);
    });
    if (!current.name) current.name = $("h2:contains(" + global.config["minecraft-version"] + ")").next("h3").text().trim();
    if (!("preview" in current)) current.preview = false;
});
