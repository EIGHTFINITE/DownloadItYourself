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
    if ((current.file === temp.file || current.file === temp.file + ".disabled") && fs.existsSync(obj.config.folder + "/" + current.file)) { // Nothing to update.
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
    if (current.disabled) temp.file = temp.file + ".disabled";
    console.log("[" + iPad + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
    request(temp.href).pipe(fs.createWriteStream(obj.config.folder + "/" + temp.file)).on("finish", function() {
        current.md5 = md5File.sync(this.path);
        current.file = temp.file;
        console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " has successfully updated.");
    });
    if (!current.name) current.name = "Forge/FML";
    if (!("disabled" in current)) current.disabled = false;
    if (!("preview" in current)) current.preview = false;
});
