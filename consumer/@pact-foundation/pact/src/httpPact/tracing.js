"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceHttpInteractions = void 0;
var http_1 = __importDefault(require("http"));
var logger_1 = __importDefault(require("../common/logger"));
var traceHttpInteractions = function () {
    var originalRequest = http_1.default.request;
    http_1.default.request = function (options, cb) {
        var requestBodyChunks = [];
        var responseBodyChunks = [];
        var hijackedCallback = function (res) {
            logger_1.default.trace("outgoing request: ".concat(JSON.stringify(__assign(__assign({}, options), { body: Buffer.concat(requestBodyChunks).toString('utf8') }))));
            if (cb) {
                cb(res);
            }
        };
        var clientRequest = originalRequest(options, hijackedCallback);
        var oldWrite = clientRequest.end.bind(clientRequest);
        clientRequest.end = function (chunk) {
            requestBodyChunks.push(Buffer.from(chunk));
            return oldWrite(chunk);
        };
        clientRequest.on('response', function (incoming) {
            incoming.on('readable', function () {
                responseBodyChunks.push(Buffer.from(incoming.read()));
            });
            incoming.on('end', function () {
                logger_1.default.trace("response: ".concat(JSON.stringify({
                    body: Buffer.concat(responseBodyChunks).toString('utf8'),
                    headers: incoming.headers,
                    statusCode: incoming.statusCode,
                })));
            });
        });
        return clientRequest;
    };
};
exports.traceHttpInteractions = traceHttpInteractions;
//# sourceMappingURL=tracing.js.map