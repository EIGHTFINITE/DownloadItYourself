/**
 * Driver for downloading from files.minecraftforge.net
 */
if (current.url.startsWith("http://")) current.url = current.url.replace("http://", "https://");
if (current.url.endsWith(".html")) {
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
} else {
    temp.href = current.url;
    temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
    downloadFile(obj, current, i, iPad, temp);
    if (!current.name) {
        if (temp.file.includes("akka-actor")) current.name = "Akka Actor";
        if (temp.file.includes("config")) current.name = "Typesafe Config";
    }
    if (!("disabled" in current)) current.disabled = false;
}
