"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
var fs_1 = __importDefault(require("fs"));
var common_1 = require("./common");
/**
 * Read file from path
 * @param  {String} path          File path
 * @return {(Object | Boolean)}   Returns the parsed data if found, or else returns `false`
 */
function readFile(path) {
    try {
        var data = fs_1.default.readFileSync(path, 'utf8');
        if (!common_1.isJsonString(data)) {
            return false;
        }
        return JSON.parse(data);
    }
    catch (err) {
        return false;
    }
}
exports.readFile = readFile;
