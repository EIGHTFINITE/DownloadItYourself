(function() {

module.exports = function(i) {
	if (global.threads[i] === false) throw new Error("Closed threads cannot be reopened.");
	if (global.threads[i] === true) throw new Error("Thread has already been opened.");
    global.threads[i] = true;
}

})();
