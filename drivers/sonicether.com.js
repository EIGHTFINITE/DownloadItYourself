/**
 * Driver for downloading from sonicether.com
 */
(function() {

temp.url = "https://sonicether.com/shaders/download/v11-0/agree.php";
cloudscraper({headers: {"Content-Type": "application/x-www-form-urlencoded"}, url: temp.url, form: {eula: 'accepted'}, method: 'POST'}, function(err, response, html) {
	// Connection error
	if(err) {
		console.log("WARNING: '" + shortUrl(remote.href) + "' failed with " + err.code + ". Retrying…");
		updateFile(i, current, temp, callback);
		return;
	}
	// Server error
	if(response.statusCode !== 200) {
		console.log("WARNING: '" + shortUrl(remote.href) + "' failed with " + response.statusCode + ". Retrying…");
		updateFile(i, current, temp, callback);
		return;
	}

	console.log("Navigating to '" + shortUrl(temp.url) + "'.");
	temp.url = "https://sonicether.com/shaders/download/v11-0/download.php";
	temp.file = "SEUS-v11.0.zip";
	temp.cookie = (response.headers['set-cookie'].join(';') + ';').match(/PHPSESSID=.*?;/).toString().slice(0,-1);
	updateFile(i, current, temp, callback);
});
if (!current.name) current.name = "Sonic Ether's Unbelievable Shaders";

}());
