/**
 * Driver for downloading from wishes2.com
 */
(function() {

// Shrinkearn URLs have to be hardcoded
if(temp.url === "http://shrinkearn.com/k3PQ") {
	temp.url = "http://www.karyonix.net/shadersmod/files/ShadersModCore-v2.3.31-mc1.7.10-f.jar";
	temp.file = temp.url.substring(temp.url.lastIndexOf("/") + 1).replace(/\?.*$/, "");
	updateFile(i, current, temp, callback);
	return;
}
throw new Error("Unreachable");

}());
