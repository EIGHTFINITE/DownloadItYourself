"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeverityBgColor = exports.color = void 0;
var lodash_get_1 = __importDefault(require("lodash.get"));
var RESET = '\x1b[0m';
var COLORS = {
    reset: {
        fg: '\x1b[0m',
        bg: '\x1b[0m',
    },
    black: {
        fg: '\x1b[30m',
        bg: '\x1b[40m',
    },
    red: {
        fg: '\x1b[31m',
        bg: '\x1b[41m',
    },
    green: {
        fg: '\x1b[32m',
        bg: '\x1b[42m',
    },
    yellow: {
        fg: '\x1b[33m',
        bg: '\x1b[43m',
    },
    blue: {
        fg: '\x1b[34m',
        bg: '\x1b[44m',
    },
    magenta: {
        fg: '\x1b[35m',
        bg: '\x1b[45m',
    },
    cyan: {
        fg: '\x1b[36m',
        bg: '\x1b[46m',
    },
    white: {
        fg: '\x1b[37m',
        bg: '\x1b[47m',
    },
};
/**
 * Color a console message's foreground and background
 * @param  {String} message     Message
 * @param  {String} fgColor     Foreground color
 * @param  {String} bgColor     Background color
 * @return {String}             Message
 */
function color(message, fgColor, bgColor) {
    return [
        lodash_get_1.default(COLORS, fgColor + ".fg", ''),
        lodash_get_1.default(COLORS, bgColor + ".bg", ''),
        message,
        RESET,
    ].join('');
}
exports.color = color;
/**
 * Get background color based on severity
 * @param {String} severity           Vulnerability's severity
 * @return {(String | undefined)}     Background color or undefined
 */
function getSeverityBgColor(severity) {
    switch (severity) {
        case 'info':
            return undefined;
        case 'low':
            return undefined;
        case 'moderate':
            return undefined;
        case 'high':
            return 'red';
        case 'critical':
            return 'red';
        default: {
            var exhaustiveCheck = severity;
            return exhaustiveCheck;
        }
    }
}
exports.getSeverityBgColor = getSeverityBgColor;
