/**
 * Driver for downloading from sonicether.com
 */
request(temp.url, function(err, response, html) {
	console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
	temp.url = "https://sonicether.com/shaders/download/v11.0/agree.php";
	request({headers: {"Content-Type": "application/x-www-form-urlencoded"}, url: temp.url, form: {eula: 'accepted'}, method: 'POST'}, function(err, response, html) {
		console.message(i, "Navigating to '" + shortUrl(temp.url) + "'.");
		temp.url = "https://sonicether.com/shaders/download/v11.0/download.php";
		temp.file = "SEUS-v11.0.zip";
		temp.cookie = (response.headers['set-cookie'].join(';') + ';').match(/PHPSESSID=.*?;/).toString().slice(0,-1);
		updateFile(i, current, temp, callback);
	});
	if (!current.name) current.name = "Sonic Ether's Unbelievable Shaders";
});
