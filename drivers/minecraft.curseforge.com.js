/**
 * Driver for downloading from minecraft.curseforge.com
 */
temp.href = current.url + "/files?" + (obj.config["curseforge-version"] ? "filter-game-version=" + obj.config["curseforge-version"] : "");
request(temp.href, function(err, response, html) {
    console.log("[" + iPad + "] Navigating to: " + temp.href);
    if (err) throw err;
    $ = cheerio.load(html);
    temp.href = response.request.uri.protocol + "//" + response.request.uri.host + $("a.overflow-tip.twitch-link").attr("href");
    request(temp.href, function(err, response, html) {
        console.log("[" + iPad + "] Navigating to: " + temp.href);
        if (err) throw err;
        $ = cheerio.load(html);
        temp.md5 = $("span.md5").text().trim();
        temp.file = $("div.info-data.overflow-tip").text().trim();
        if (current.md5 === temp.md5 && (current.file === temp.file || current.file === temp.file + ".disabled") && fs.existsSync(obj.config.folder + "/" + current.file)) { // Nothing to update.
            console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " is already up to date.");
            if (!current.disabled && current.file.endsWith(".disabled")) {
                temp.file = current.file.substring(0, current.file.length - 9);
                console.log("[" + iPad + "] Enabling " + (current.name ? current.name : current.url) + ".");
                fs.rename(obj.config.folder + "/" + current.file, obj.config.folder + "/" + temp.file, function(err) {
                    if (err) throw err;
                    current.file = temp.file;
                });
                return; // File has been enabled. Stop.
            }
            if (current.disabled && !current.file.endsWith(".disabled")) {
                temp.file = current.file + ".disabled";
                console.log("[" + iPad + "] Disabling " + (current.name ? current.name : current.url) + ".");
                fs.rename(obj.config.folder + "/" + current.file, obj.config.folder + "/" + temp.file, function(err) {
                    if (err) throw err;
                    current.file = temp.file;
                });
                return; // File has been disabled. Stop.
            }
            return; // Nothing more to do. Stop.
        }
        if (current.file && fs.existsSync(obj.config.folder + "/" + current.file)) {
            console.log("[" + iPad + '] Deleting outdated file: "' + current.file + '".');
            fs.unlinkSync(obj.config.folder + "/" + current.file);
        }
        temp.href = response.request.uri.protocol + "//" + response.request.uri.host + $("a.button.fa-icon-download:not(.alt)").attr("href");
        if (current.disabled) temp.file = temp.file + ".disabled";
        console.log("[" + iPad + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
        request(temp.href).pipe(fs.createWriteStream(obj.config.folder + "/" + temp.file)).on("finish", function() {
            current.md5 = md5File.sync(this.path);
            if (current.md5 !== temp.md5) {
                console.log("[" + iPad + "] MD5 mismatch for " + (current.name ? current.name : current.url) + ". Download failed.");
                throw new Error("MD5 mismatch");
            }
            console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " has successfully updated. (MD5 matches)");
            current.file = temp.file;
        });
    });
    if (!current.name) current.name = $("h1.project-title").text().trim();
    if (!("disabled" in current)) current.disabled = false;
});
