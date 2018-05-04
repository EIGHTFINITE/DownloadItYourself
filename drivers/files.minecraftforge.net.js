/**
 * Driver for downloading from files.minecraftforge.net
 */
if (current.url.startsWith("http://")) current.url = current.url.replace("http://", "https://");
if (current.url.endsWith(".html")) {
    request(current.url, function(err, response, html) {
        console.message("Navigating to: '" + current.url + "'.", i, MESSAGE_VERBOSE);
        if (err) throw err;
        $ = cheerio.load(html);
        if (current.preview === true) temp.href = $(".downloads>.download>.title>.promo-latest").parent().parent().find(".links .link .classifier-universal").parent().attr("href");
        else temp.href = $(".downloads>.download>.title>.promo-recommended").parent().parent().find(".links .link .classifier-universal").parent().attr("href");
        temp.href = temp.href.substring(temp.href.indexOf('&url=') + 5);
        temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
        downloadFile(i, current, temp);
        if (!current.name) current.name = "Forge/FML";
        if (!("disabled" in current)) current.disabled = false;
        if (!("preview" in current)) current.preview = false;
    });
} else {
    temp.href = current.url;
    temp.file = temp.href.substring(temp.href.lastIndexOf("/") + 1);
    downloadFile(i, current, temp);
    if (!current.name) {
        if (temp.file.includes("akka-actor")) current.name = "Akka Actor";
        if (temp.file.includes("config")) current.name = "Typesafe Config";
        if (temp.file.includes("scala-actors-migration")) current.name = "Scala Actor Migration Kit";
        if (temp.file.includes("scala-compiler")) current.name = "Scala Compiler API";
        if (temp.file.includes("scala-continuations-library")) current.name = "Scala Continuations Library";
        if (temp.file.includes("scala-continuations-plugin")) current.name = "Scala Continuations Plugin";
        if (temp.file.includes("scala-library")) current.name = "Scala Library API";
        if (temp.file.includes("scala-parser-combinators")) current.name = "Scala Standard Parser Combinator Library";
        if (temp.file.includes("scala-reflect")) current.name = "Scala Reflection API";
        if (temp.file.includes("scala-swing")) current.name = "Scala Swing API";
        if (temp.file.includes("scala-xml")) current.name = "Scala XML API";
    }
    if (!("disabled" in current)) current.disabled = false;
}
