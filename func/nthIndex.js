module.exports = function(str, pat, n) {
	var L = str.length;
	var i = -1;
	while (n-- && i++ < L) {
		i = str.indexOf(pat, i);
		if (i < 0) break;
	}
	return i;
}
