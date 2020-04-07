(function() {

// Libraries
var is = require('@sindresorhus/is');

module.exports = function(i) {
	if (is.undefined(global.threads[i])) throw new Error("Cannot close nonexistent thread [" + i + "].");
	if (global.threads[i] === false) throw new Error("Thread [" + i + "] has already been closed.");
    global.threads[i] = false;
}

})();
