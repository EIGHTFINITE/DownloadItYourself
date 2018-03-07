/**
 * Driver for downloading from optifine.net
 */
request(current.url, function(err, response, html) {
    console.log("[" + iPad + "] Navigating to: " + current.url);
    if (err) throw err;
    $ = cheerio.load(html);
    temp.href = $("h2.header-version:contains(DOWNLOADS)").nextAll("p").find("a").attr("href");
    temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
    if (current.file === temp.file && fs.existsSync(obj.config.folder + "/" + temp.file)) {
        console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " is already up to date.");
        return;
    }
    if (current.file && fs.existsSync(obj.config.folder + "/" + current.file)) {
        console.log("[" + iPad + '] Deleting outdated file: "' + current.file + '".');
        fs.unlinkSync(obj.config.folder + "/" + current.file);
    }
    console.log("[" + iPad + "] Downloading: " + temp.href + ' as "' + temp.file + '"');
    request(temp.href).pipe(fs.createWriteStream(obj.config.folder + "/" + temp.file)).on("finish", function() {
        current.md5 = md5File.sync(this.path);
        current.file = temp.file;
        console.log("[" + iPad + "] " + (current.name ? current.name : current.url) + " has successfully updated.");
    });
    if (!current.name) current.name = "Shaders Mod";
});
