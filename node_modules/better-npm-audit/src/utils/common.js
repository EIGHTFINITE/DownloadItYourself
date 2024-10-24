"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenNodePath = exports.trimArray = exports.isJsonString = exports.isWholeNumber = void 0;
// TODO: This might be unused
/**
 * @param  {String | Number | Null | Boolean} value     The input number
 * @return {Boolean}                                    Returns true if the input is a whole number
 */
function isWholeNumber(value) {
    if (value === null || value === undefined) {
        return false;
    }
    if (!Number(value)) {
        return false;
    }
    return Number(value) % 1 === 0;
}
exports.isWholeNumber = isWholeNumber;
/**
 * @param  {String} string    The JSON stringified object
 * @return {Boolean}          Returns true if the input string is parse-able
 */
function isJsonString(string) {
    try {
        JSON.parse(string);
    }
    catch (e) {
        console.log('Failed parsing .nsprc file: ' + e);
        return false;
    }
    return true;
}
exports.isJsonString = isJsonString;
// TODO: Add unit tests
/**
 * Trim array size to a maximum number
 * @param {Array} array       Array to trim
 * @param {Number} maxLength  Desired length
 * @return {Array}            Trimmed array with additional message
 */
function trimArray(array, maxLength) {
    var originalLength = array.length;
    var removedLength = Math.max(0, originalLength - maxLength);
    if (removedLength === 0) {
        return array;
    }
    array.length = maxLength;
    return array.concat("...and " + removedLength + " more");
}
exports.trimArray = trimArray;
/**
 * Shorten node path (node_modules/nodemon/node_modules/chokidar/node_modules/fsevents) to (nodemon>chokidar>fsevents)
 * @param {String} path Full node path
 * @return {String}     Shorten Path
 */
function shortenNodePath(path) {
    return path.replace('node_modules/', '').replace(/\/node_modules\//g, '>');
}
exports.shortenNodePath = shortenNodePath;
