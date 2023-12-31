"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PactV3 = void 0;
/* eslint-disable import/first */
var ramda_1 = require("ramda");
var pact_core_1 = require("@pact-foundation/pact-core");
var util_1 = require("util");
var fs = require("fs");
var package_json_1 = require("../../package.json");
var types_1 = require("./types");
var matchers_1 = require("./matchers");
var display_1 = require("./display");
var logger_1 = __importDefault(require("../common/logger"));
var readBinaryData = function (file) {
    try {
        var body = fs.readFileSync(file);
        return body;
    }
    catch (e) {
        throw new Error("unable to read file for binary request: ".concat(e.message));
    }
};
var PactV3 = /** @class */ (function () {
    function PactV3(opts) {
        this.states = [];
        this.opts = opts;
        this.setup();
    }
    // JSON object interface for V3, to aid with migration from the previous major version
    PactV3.prototype.addInteraction = function (interaction) {
        var _this = this;
        if (interaction.uponReceiving === '') {
            throw new Error("must provide a valid interaction description via 'uponReceiving'");
        }
        (interaction.states || []).forEach(function (s) {
            _this.given(s.description, s.parameters);
        });
        this.uponReceiving(interaction.uponReceiving);
        this.withRequest(interaction.withRequest);
        this.willRespondWith(interaction.willRespondWith);
        return this;
    };
    // TODO: this currently must be called before other methods, else it won't work
    PactV3.prototype.given = function (providerState, parameters) {
        if (parameters) {
            var json = JSON.stringify(parameters);
            // undefined arguments not supported (invalid JSON)
            if (json === undefined) {
                throw new Error("Invalid provider state parameter received. Parameters must not be undefined. Received: ".concat(parameters));
            }
            // Check nested objects
            var jsonParsed = JSON.parse(json);
            if (!(0, ramda_1.equals)(parameters, jsonParsed)) {
                throw new Error("Invalid provider state parameter received. Parameters must not contain undefined values. Received: ".concat(parameters));
            }
        }
        this.states.push({ description: providerState, parameters: parameters });
        return this;
    };
    PactV3.prototype.uponReceiving = function (description) {
        var _this = this;
        this.interaction = this.pact.newInteraction(description);
        this.states.forEach(function (s) {
            if (s.parameters) {
                (0, ramda_1.forEachObjIndexed)(function (v, k) {
                    _this.interaction.givenWithParam(s.description, "".concat(k), JSON.stringify(v));
                }, s.parameters);
            }
            else {
                _this.interaction.given(s.description);
            }
        });
        return this;
    };
    PactV3.prototype.withRequest = function (req) {
        if (req.body) {
            this.interaction.withRequestBody((0, matchers_1.matcherValueOrString)(req.body), req.contentType ||
                contentTypeFromHeaders(req.headers, 'application/json'));
        }
        setRequestDetails(this.interaction, req);
        return this;
    };
    PactV3.prototype.withRequestBinaryFile = function (req, contentType, file) {
        var body = readBinaryData(file);
        this.interaction.withRequestBinaryBody(body, contentType);
        setRequestDetails(this.interaction, req);
        return this;
    };
    PactV3.prototype.withRequestMultipartFileUpload = function (req, contentType, file, mimePartName) {
        this.interaction.withRequestMultipartBody(contentType, file, mimePartName);
        setRequestDetails(this.interaction, req);
        return this;
    };
    PactV3.prototype.willRespondWith = function (res) {
        setResponseDetails(this.interaction, res);
        if (res.body) {
            this.interaction.withResponseBody((0, matchers_1.matcherValueOrString)(res.body), res.contentType ||
                contentTypeFromHeaders(res.headers, 'application/json') // TODO: extract // force correct content-type header?
            );
        }
        this.states = [];
        return this;
    };
    PactV3.prototype.withResponseBinaryFile = function (res, contentType, file) {
        var body = readBinaryData(file);
        this.interaction.withResponseBinaryBody(body, contentType);
        setResponseDetails(this.interaction, res);
        return this;
    };
    PactV3.prototype.withResponseMultipartFileUpload = function (res, contentType, file, mimePartName) {
        this.interaction.withResponseMultipartBody(contentType, file, mimePartName);
        setResponseDetails(this.interaction, res);
        return this;
    };
    PactV3.prototype.executeTest = function (testFn) {
        return __awaiter(this, void 0, void 0, function () {
            var scheme, host, port, server, val, error, e_1, matchingResults, errors, success, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scheme = this.opts.tls ? 'https' : 'http';
                        host = this.opts.host || '127.0.0.1';
                        port = this.pact.createMockServer(host, this.opts.port, this.opts.tls);
                        server = { port: port, url: "".concat(scheme, "://").concat(host, ":").concat(port), id: 'unknown' };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, testFn(server)];
                    case 2:
                        val = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.cleanup(false, server);
                        error = e_1;
                        return [3 /*break*/, 4];
                    case 4:
                        matchingResults = this.pact.mockServerMismatches(port);
                        errors = (0, display_1.filterMissingFeatureFlag)(matchingResults);
                        success = this.pact.mockServerMatchedSuccessfully(port);
                        if (!success && errors.length > 0) {
                            errorMessage = 'Test failed for the following reasons:';
                            errorMessage += "\n\n  ".concat((0, display_1.generateMockServerError)(matchingResults, '\t'));
                            this.cleanup(false, server);
                            // If the tests throws an error, we need to rethrow the error, but print out
                            // any additional mock server errors to help the user understand what happened
                            // (The proximate cause here is often the HTTP 500 from the mock server,
                            // where the HTTP client then throws)
                            if (error) {
                                logger_1.default.error(errorMessage);
                                throw error;
                            }
                            // Test didn't throw, so we need to ensure the test fails
                            return [2 /*return*/, Promise.reject(new Error(errorMessage))];
                        }
                        this.cleanup(true, server);
                        return [2 /*return*/, val];
                }
            });
        });
    };
    PactV3.prototype.cleanup = function (success, server) {
        if (success) {
            this.pact.writePactFile(this.opts.dir || './pacts');
        }
        this.pact.cleanupMockServer(server.port);
        this.setup();
    };
    // reset the internal state
    // (this.pact cannot be re-used between tests)
    PactV3.prototype.setup = function () {
        var _a, _b;
        this.states = [];
        this.pact = (0, pact_core_1.makeConsumerPact)(this.opts.consumer, this.opts.provider, (_a = this.opts.spec) !== null && _a !== void 0 ? _a : types_1.SpecificationVersion.SPECIFICATION_VERSION_V3, (_b = this.opts.logLevel) !== null && _b !== void 0 ? _b : 'info');
        this.pact.addMetadata('pact-js', 'version', package_json_1.version);
    };
    return PactV3;
}());
exports.PactV3 = PactV3;
var setRequestDetails = function (interaction, req) {
    interaction.withRequest(req.method, (0, matchers_1.matcherValueOrString)(req.path));
    (0, ramda_1.forEachObjIndexed)(function (v, k) {
        interaction.withRequestHeader(k, 0, (0, matchers_1.matcherValueOrString)(v));
    }, req.headers);
    (0, ramda_1.forEachObjIndexed)(function (v, k) {
        if ((0, util_1.isArray)(v)) {
            v.forEach(function (vv, i) {
                interaction.withQuery(k, i, (0, matchers_1.matcherValueOrString)(vv));
            });
        }
        else {
            interaction.withQuery(k, 0, (0, matchers_1.matcherValueOrString)(v));
        }
    }, req.query);
};
var setResponseDetails = function (interaction, res) {
    interaction.withStatus(res.status);
    (0, ramda_1.forEachObjIndexed)(function (v, k) {
        interaction.withResponseHeader(k, 0, (0, matchers_1.matcherValueOrString)(v));
    }, res.headers);
};
var contentTypeFromHeaders = function (headers, defaultContentType) {
    var contentType = defaultContentType;
    (0, ramda_1.forEachObjIndexed)(function (v, k) {
        if ("".concat(k).toLowerCase() === 'content-type') {
            contentType = (0, matchers_1.matcherValueOrString)(v);
        }
    }, headers || {});
    return contentType;
};
//# sourceMappingURL=pact.js.map