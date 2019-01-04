(function() {

module.exports = function(i) {
	if (typeof global.threads[i] === "undefined") throw new Error("Cannot close nonexistent thread [" + i + "].");
	if (global.threads[i] === false) throw new Error("Thread [" + i + "] has already been closed.");
    global.threads[i] = false;
}

})();
