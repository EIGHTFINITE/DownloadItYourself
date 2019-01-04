(function() {

module.exports = function(i) {
	if (global.threads[i] === false) throw new Error("Thread [" + i + "] has already been closed and cannot be reopened.");
	if (global.threads[i] === true) throw new Error("Thread [" + i + "] has already been opened.");
    global.threads[i] = true;
}

})();
