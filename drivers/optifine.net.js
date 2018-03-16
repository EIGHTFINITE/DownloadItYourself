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
        if ((current.file === temp.file || current.file === temp.file + ".disabled") && fs.existsSync((current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + current.file)) { // Nothing to update.
            console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " is already up to date.");
            if (!current.disabled && current.file.endsWith(".disabled")) {
                temp.file = current.file.substring(0, current.file.length - 9);
                console.log("[" + iPad + "] Enabling " + (current.name ? current.name : current.url) + ".");
                fs.rename((current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + current.file, (current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + temp.file, function(err) {
                    if (err) throw err;
                    current.file = temp.file;
                });
                return; // File has been enabled. Stop.
            }
            if (current.disabled && !current.file.endsWith(".disabled")) {
                temp.file = current.file + ".disabled";
                console.log("[" + iPad + "] Disabling " + (current.name ? current.name : current.url) + ".");
                fs.rename((current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + current.file, (current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + temp.file, function(err) {
                    if (err) throw err;
                    current.file = temp.file;
                });
                return; // File has been disabled. Stop.
            }
            return; // Nothing more to do. Stop.
        }
        if (current.file && fs.existsSync((current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + current.file)) {
            console.log("[" + iPad + '] Deleting outdated file: "' + current.file + '".');
            fs.unlinkSync((current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + current.file);
        }
        temp.href = response.request.uri.protocol + "//" + response.request.uri.host + "/" + $("span#Download a").attr("href");
        if (current.disabled) temp.file = temp.file + ".disabled";
        console.log("[" + iPad + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
        request(temp.href).pipe(fs.createWriteStream((current["folder-override"] ? current["folder-override"] : obj.config.folder) + "/" + temp.file)).on("finish", function() {
            current.md5 = md5File.sync(this.path);
            current.file = temp.file;
            console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " has successfully updated.");
        });
    });
    if (!current.name) current.name = $("h2:contains(" + obj.config.version + ")").next("h3").text().trim();
    if (!("disabled" in current)) current.disabled = false;
    if (!("preview" in current)) current.preview = false;
});
