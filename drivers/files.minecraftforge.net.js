/**
 * Driver for downloading from files.minecraftforge.net
 */
request(current.url, function(err, response, html) {
    console.log("[" + iPad + "] Navigating to: " + current.url);
    if (err) throw err;
    $ = cheerio.load(html);
    if (current.preview === true) temp.href = $(".downloads>.download>.title>.promo-latest").parent().parent().find(".links .link .classifier-universal").parent().attr("href");
    else temp.href = $(".downloads>.download>.title>.promo-recommended").parent().parent().find(".links .link .classifier-universal").parent().attr("href");
    temp.href = temp.href.substring(temp.href.indexOf('&url=') + 5);
    temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
    downloadFile(obj, current, i, iPad, temp);
    if (!current.name) current.name = "Forge/FML";
    if (!("disabled" in current)) current.disabled = false;
    if (!("preview" in current)) current.preview = false;
});
