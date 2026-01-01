"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNpmVersion = void 0;
var child_process_1 = require("child_process");
/**
 * Get the current npm version
 * @return {String} The npm version
 */
function getNpmVersion() {
    var version = child_process_1.execSync('npm --version');
    return version.toString();
}
exports.getNpmVersion = getNpmVersion;
