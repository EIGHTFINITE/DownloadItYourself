/**
 * Driver for downloading from optifine.net
 */
request(current.url, function(err, response, html) {
    console.message(i, "Navigating to: '" + current.url + "'.", MESSAGE_VERBOSE);
    if (err) throw err;
    $ = cheerio.load(html);
    var previewBuilds = $("span#preview td.downloadLineFile:contains(1.7.10)").nextAll("td.downloadLineMirror").children("a");
    if (current.preview === true && previewBuilds.length > 0) temp.href = previewBuilds.attr("href");
    else temp.href = $("h2:contains(" + global.config.version + ")").nextAll("table.downloadTable").first().find("td.downloadLineMirror a").attr("href");
    request(temp.href, function(err, response, html) {
        console.message(i, "Navigating to: '" + temp.href + "'.", MESSAGE_VERBOSE);
        if (err) throw err;
        $ = cheerio.load(html);
        temp.file = $("span#Download a").text().trim().replace(/^(Download )/, "").trim();
        temp.href = response.request.uri.protocol + "//" + response.request.uri.host + "/" + $("span#Download a").attr("href");
        downloadFile(i, current, temp);
    });
    if (!current.name) current.name = $("h2:contains(" + global.config.version + ")").next("h3").text().trim();
    if (!("disabled" in current)) current.disabled = false;
    if (!("preview" in current)) current.preview = false;
});
