"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var print_1 = require("../utils/print");
var vulnerability_1 = require("../utils/vulnerability");
/**
 * Process and analyze the NPM audit JSON
 * @param  {String} jsonBuffer        NPM audit stringified JSON payload
 * @param  {Number} auditLevel        The level of vulnerabilities we care about
 * @param  {Array} exceptionIds       List of vulnerability IDs to exclude
 * @param  {Array} exceptionModules   List of vulnerable modules to ignore in audit results
 * @param  {Array} columnsToInclude   List of columns to include in audit results
 */
function handleFinish(jsonBuffer, auditLevel, exceptionIds, exceptionModules, columnsToInclude) {
    var _a = vulnerability_1.processAuditJson(jsonBuffer, auditLevel, exceptionIds, exceptionModules, columnsToInclude), unhandledIds = _a.unhandledIds, report = _a.report, failed = _a.failed, unusedExceptionIds = _a.unusedExceptionIds, unusedExceptionModules = _a.unusedExceptionModules;
    // If unable to process the audit JSON
    if (failed) {
        console.log('Unable to process the JSON buffer string.');
        // Exit failed
        process.exit(1);
        return;
    }
    // Print the security report
    if (report.length) {
        print_1.printSecurityReport(report, columnsToInclude);
    }
    // Display the found unhandled vulnerabilities
    if (unhandledIds.length) {
        console.log(unhandledIds.length + " vulnerabilities found. Node security advisories: " + unhandledIds.join(', '));
        // Exit failed
        process.exit(1);
    }
    else {
        // Happy happy, joy joy
        process.exit(0);
    }
}
exports.default = handleFinish;
