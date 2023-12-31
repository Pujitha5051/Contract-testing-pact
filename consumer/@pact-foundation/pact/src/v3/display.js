"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockServerError = exports.printMismatch = exports.filterMissingFeatureFlag = exports.displayRequest = exports.displayQuery = void 0;
/* eslint-disable import/first */
var ramda_1 = require("ramda");
function displayQuery(query) {
    var pairs = (0, ramda_1.toPairs)(query);
    var mapped = (0, ramda_1.flatten)((0, ramda_1.map)(function (_a) {
        var key = _a[0], values = _a[1];
        return (0, ramda_1.map)(function (val) { return "".concat(key, "=").concat(val); }, values);
    }, pairs));
    return (0, ramda_1.join)('&', mapped);
}
exports.displayQuery = displayQuery;
function displayHeaders(headers, indent) {
    return (0, ramda_1.join)("\n".concat(indent), (0, ramda_1.map)(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, ": ").concat(v);
    }, (0, ramda_1.toPairs)(headers)));
}
function displayRequest(request, indent) {
    if (indent === void 0) { indent = ''; }
    var output = [''];
    output.push("".concat(indent, "Method: ").concat(request.method, "\n").concat(indent, "Path: ").concat(request.path));
    if (request.query) {
        output.push("".concat(indent, "Query String: ").concat(displayQuery(request.query)));
    }
    if (request.headers) {
        output.push("".concat(indent, "Headers:\n").concat(indent, "  ").concat(displayHeaders(request.headers, "".concat(indent, "  "))));
    }
    if (request.body) {
        var body = JSON.stringify(request.body);
        output.push("".concat(indent, "Body: ").concat(body.substr(0, 20), "... (").concat(body.length, " length)"));
    }
    return output.join('\n');
}
exports.displayRequest = displayRequest;
function filterMissingFeatureFlag(mismatches) {
    if (process.env.PACT_EXPERIMENTAL_FEATURE_ALLOW_MISSING_REQUESTS) {
        return mismatches.filter(function (m) { return m.type !== 'request-mismatch'; });
    }
    return mismatches;
}
exports.filterMissingFeatureFlag = filterMissingFeatureFlag;
function printMismatch(m) {
    switch (m.type) {
        case 'MethodMismatch':
            return "Expected ".concat(m.expected, ", got: ").concat(m.actual);
        default:
            return m.mismatch;
    }
}
exports.printMismatch = printMismatch;
function generateMockServerError(mismatches, indent) {
    return __spreadArray([
        'Mock server failed with the following mismatches:'
    ], mismatches.map(function (mismatch, i) {
        var _a;
        if (mismatch.type === 'request-mismatch') {
            return "\n".concat(indent).concat(i, ") The following request was incorrect: \n\n          ").concat(indent).concat(mismatch.method, " ").concat(mismatch.path, "\n          ").concat((_a = mismatch.mismatches) === null || _a === void 0 ? void 0 : _a.map(function (d, j) {
                return "\n".concat(indent).concat(indent).concat(indent, " 1.").concat(j, " ").concat(printMismatch(d));
            }).join(''));
        }
        if (mismatch.type === 'request-not-found') {
            return "\n".concat(indent).concat(i, ") The following request was not expected: ").concat(displayRequest(mismatch.request, "".concat(indent, "    ")));
        }
        if (mismatch.type === 'missing-request') {
            return "\n".concat(indent).concat(i, ") The following request was expected but not received: ").concat(displayRequest(mismatch.request, "".concat(indent, "    ")));
        }
        return '';
    }), true).join('\n');
}
exports.generateMockServerError = generateMockServerError;
//# sourceMappingURL=display.js.map