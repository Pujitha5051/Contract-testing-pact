"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestTracer = exports.createResponseTracer = void 0;
var lodash_1 = require("lodash");
var logger_1 = __importDefault(require("../../../common/logger"));
var removeEmptyResponseProperties = function (body, res) {
    return (0, lodash_1.pickBy)({
        body: body,
        headers: (0, lodash_1.reduce)(res.getHeaders(), function (acc, val, index) {
            acc[index] = val;
            return acc;
        }, {}),
        status: res.statusCode,
    }, lodash_1.identity);
};
var removeEmptyRequestProperties = function (req) {
    return (0, lodash_1.pickBy)({
        body: req.body,
        headers: req.headers,
        method: req.method,
        path: req.path,
    }, lodash_1.identity);
};
var createResponseTracer = function () { return function (_, res, next) {
    var _a = [res.write, res.end], oldWrite = _a[0], oldEnd = _a[1];
    var chunks = [];
    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));
        return oldWrite.apply(res, [chunk]);
    };
    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        var body = Buffer.concat(chunks).toString('utf8');
        logger_1.default.debug("outgoing response: ".concat(JSON.stringify(removeEmptyResponseProperties(body, res))));
        oldEnd.apply(res, [chunk]);
    };
    if (typeof next === 'function') {
        next();
    }
}; };
exports.createResponseTracer = createResponseTracer;
var createRequestTracer = function () { return function (req, _, next) {
    logger_1.default.debug("incoming request: ".concat(JSON.stringify(removeEmptyRequestProperties(req))));
    next();
}; };
exports.createRequestTracer = createRequestTracer;
//# sourceMappingURL=tracer.js.map