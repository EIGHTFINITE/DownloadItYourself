"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeExpiry = exports.isValidDate = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
/**
 * Validate if the given timestamp is a valid UNIX timestamp
 * @param   {Any} timestamp   The given timestamp
 * @return  {Boolean}         Returns true if it is a valid UNIX timestamp
 */
function isValidDate(timestamp) {
    return new Date(timestamp).getTime() > 0;
}
exports.isValidDate = isValidDate;
/**
 * Analyze the given date time if it has expired (in the past)
 * @param  {String | Number} expiry     Expiry timestamp
 * @param  {String | Number} now        The date to compare with
 * @return {Object}                     Return the analysis
 */
function analyzeExpiry(expiry, now) {
    if (now === void 0) { now = new Date().valueOf(); }
    if (!expiry) {
        return { valid: true };
    }
    if (!isValidDate(expiry) || !isValidDate(now)) {
        return { valid: false };
    }
    var dayjsNow = dayjs_1.default(now);
    return {
        valid: true,
        expired: dayjsNow.isAfter(expiry),
        years: dayjsNow.diff(expiry, 'years'),
    };
}
exports.analyzeExpiry = analyzeExpiry;
