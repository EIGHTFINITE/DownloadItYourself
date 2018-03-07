/**
 * Driver for downloading from optifine.net
 */
request(current.url, function(err, response, html) {
    console.log("[" + iPad + "] Navigating to: " + current.url);
    if (err) throw err;
    $ = cheerio.load(html);
    if (current.preview === true) temp.href = $("span#preview td.downloadLineFile:contains(1.7.10)").nextAll("td.downloadLineMirror").children("a").attr("href");
    else temp.href = $("h2:contains(" + obj.config.version + ")").nextAll("table.downloadTable").first().find("td.downloadLineMirror a").attr("href");
    request(temp.href, function(err, response, html) {
        console.log("[" + iPad + "] Navigating to: " + temp.href);
        if (err) throw err;
        $ = cheerio.load(html);
        temp.file = $("span#Download a").text().trim().replace(/^(Download )/, "").trim();
        if (current.file === temp.file && fs.existsSync(obj.config.folder + "/" + temp.file)) {
            console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " is already up to date.");
            return;
        }
        if (current.file && fs.existsSync(obj.config.folder + "/" + current.file)) {
            console.log("[" + iPad + '] Deleting outdated file: "' + current.file + '".');
            fs.unlinkSync(obj.config.folder + "/" + current.file);
        }
        temp.href = response.request.uri.protocol + "//" + response.request.uri.host + "/" + $("span#Download a").attr("href");
        console.log("[" + iPad + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
        request(temp.href).pipe(fs.createWriteStream(obj.config.folder + "/" + temp.file)).on("finish", function() {
            current.md5 = md5File.sync(this.path);
            current.file = temp.file;
            console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " has successfully updated.");
        });
    });
    if (!current.name) current.name = $("h2:contains(" + obj.config.version + ")").next("h3").text().trim();
    if (!("disabled" in current)) current.disabled = false;
    if (!("preview" in current)) current.preview = false;
});
