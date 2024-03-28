#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback = void 0;
var commander_1 = require("commander");
var child_process_1 = require("child_process");
var handleInput_1 = __importDefault(require("./src/handlers/handleInput"));
var handleFinish_1 = __importDefault(require("./src/handlers/handleFinish"));
var package_json_1 = __importDefault(require("./package.json"));
var MAX_BUFFER_SIZE = 1024 * 1000 * 50; // 50 MB
var program = new commander_1.Command();
/**
 * Run audit
 * @param  {String} auditCommand    The NPM audit command to use (with flags)
 * @param  {String} auditLevel      The level of vulnerabilities we care about
 * @param  {Array}  exceptionIds    List of vulnerability IDs to exclude
 * @param  {Array} modulesToIgnore   List of vulnerable modules to ignore in audit results
 */
function callback(auditCommand, auditLevel, exceptionIds, modulesToIgnore) {
    // Increase the default max buffer size (1 MB)
    var audit = child_process_1.exec(auditCommand + " --json", { maxBuffer: MAX_BUFFER_SIZE });
    // Grab the data in chunks and buffer it as we're unable to parse JSON straight from stdout
    var jsonBuffer = '';
    if (audit.stdout) {
        audit.stdout.on('data', function (data) { return (jsonBuffer += data); });
    }
    // Once the stdout has completed, process the output
    if (audit.stderr) {
        audit.stderr.on('close', function () { return handleFinish_1.default(jsonBuffer, auditLevel, exceptionIds, modulesToIgnore); });
        // stderr
        audit.stderr.on('data', console.log);
    }
}
exports.callback = callback;
program.name(package_json_1.default.name).version(package_json_1.default.version);
program
    .command('audit')
    .description('execute npm audit')
    .option('-x, --exclude <ids>', 'Exceptions or the vulnerabilities ID(s) to exclude.')
    .option('-m, --module-ignore <moduleNames>', 'Names of modules to ignore.')
    .option('-l, --level <auditLevel>', 'The minimum audit level to validate.')
    .option('-p, --production', 'Skip checking the devDependencies.')
    .option('-r, --registry <url>', 'The npm registry url to use.')
    .action(function (options) { return handleInput_1.default(options, callback); });
program.parse(process.argv);
