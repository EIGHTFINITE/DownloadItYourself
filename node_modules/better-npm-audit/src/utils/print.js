"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printExceptionReport = exports.printSecurityReport = exports.getColumnWidth = void 0;
var lodash_get_1 = __importDefault(require("lodash.get"));
var table_1 = require("table");
var SECURITY_REPORT_HEADER = ['ID', 'Module', 'Title', 'Paths', 'Sev.', 'URL', 'Ex.'];
var EXCEPTION_REPORT_HEADER = ['ID', 'Status', 'Expiry', 'Notes'];
// TODO: Add unit tests
/**
 * Get the column width size for the table
 * @param {Array} tableData     Table data (Array of array)
 * @param {Number} columnIndex  Target column index
 * @param {Number} maxWidth     Maximum width
 * @param {Number} minWidth     Minimum width
 * @return {Number}             width
 */
function getColumnWidth(tableData, columnIndex, maxWidth, minWidth) {
    if (maxWidth === void 0) { maxWidth = 50; }
    if (minWidth === void 0) { minWidth = 15; }
    // Find the maximum length in the column
    var contentLength = tableData.reduce(function (max, cur) {
        var content = JSON.stringify(lodash_get_1.default(cur, columnIndex, ''));
        // Remove the color codes
        content = content.replace(/\\x1b\[\d{1,2}m/g, '');
        content = content.replace(/\\u001b\[\d{1,2}m/g, '');
        content = content.replace(/"/g, '');
        // Keep whichever number that is bigger
        return content.length > max ? content.length : max;
    }, 
    // Start with minimum width (also auto handling empty column case)
    minWidth);
    // Return the content length up to a maximum point
    return Math.min(contentLength, maxWidth);
}
exports.getColumnWidth = getColumnWidth;
/**
 * Print the security report in a table format
 * @param  {Array} data   Array of arrays
 * @return {undefined}    Returns void
 */
function printSecurityReport(data) {
    var configs = {
        singleLine: true,
        columns: {
            // "Title" column index
            2: {
                width: getColumnWidth(data, 2),
                wrapWord: true,
            },
            // "Paths" column index
            3: {
                width: getColumnWidth(data, 3),
                wrapWord: true,
            },
        },
    };
    console.log(table_1.table(__spreadArray([SECURITY_REPORT_HEADER], data), configs));
}
exports.printSecurityReport = printSecurityReport;
/**
 * Print the exception report in a table format
 * @param  {Array} data   Array of arrays
 * @return {undefined}    Returns void
 */
function printExceptionReport(data) {
    var configs = {
        singleLine: true,
    };
    console.log(table_1.table(__spreadArray([EXCEPTION_REPORT_HEADER], data), configs));
}
exports.printExceptionReport = printExceptionReport;
