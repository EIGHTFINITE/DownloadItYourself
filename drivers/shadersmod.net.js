/**
 * Driver for downloading from shadersmod.net
 */
request(current.url, function(err, response, html) {
    console.log("[" + iPad + "] Navigating to: " + current.url);
    if (err) throw err;
    $ = cheerio.load(html);
    temp.href = $("h2.header-version:contains(DOWNLOADS)").nextAll("p").find("a").attr("href");
    temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
    downloadFile(obj, current, i, iPad, temp);
    if (!current.name) current.name = "Shaders Mod";
    if (!("disabled" in current)) current.disabled = false;
});
