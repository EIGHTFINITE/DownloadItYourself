(function() {

module.exports = function(i) {
	if (global.threads[i] === false) throw new Error("Thread has already been closed.");
    global.threads[i] = false;
}

})();
