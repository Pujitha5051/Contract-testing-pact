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
exports.Request = exports.HTTPMethods = void 0;
var axios_1 = __importDefault(require("axios"));
var https_1 = __importDefault(require("https"));
var ramda_1 = require("ramda");
var logger_1 = __importDefault(require("./logger"));
// eslint-disable-next-line no-shadow
var HTTPMethods;
(function (HTTPMethods) {
    HTTPMethods["GET"] = "GET";
    HTTPMethods["POST"] = "POST";
    HTTPMethods["PUT"] = "PUT";
    HTTPMethods["PATCH"] = "PATCH";
    HTTPMethods["DELETE"] = "DELETE";
    HTTPMethods["HEAD"] = "HEAD";
    HTTPMethods["OPTIONS"] = "OPTIONS";
    HTTPMethods["COPY"] = "COPY";
    HTTPMethods["LOCK"] = "LOCK";
    HTTPMethods["MKCOL"] = "MKCOL";
    HTTPMethods["MOVE"] = "MOVE";
    HTTPMethods["PROPFIND"] = "PROPFIND";
    HTTPMethods["PROPPATCH"] = "PROPPATCH";
    HTTPMethods["UNLOCK"] = "UNLOCK";
    HTTPMethods["REPORT"] = "REPORT";
})(HTTPMethods = exports.HTTPMethods || (exports.HTTPMethods = {}));
var Request = /** @class */ (function () {
    function Request() {
    }
    Request.prototype.send = function (method, url, body) {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, axios_1.default)(url, {
                                data: body,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Pact-Mock-Service': 'true',
                                },
                                httpsAgent: new https_1.default.Agent({
                                    keepAlive: true,
                                    rejectUnauthorized: false,
                                }),
                                method: method,
                                timeout: 10000,
                                url: url,
                                maxBodyLength: Infinity,
                            })];
                    case 1:
                        res = _a.sent();
                        if (res.status >= 200 && res.status < 400) {
                            return [2 /*return*/, res.data];
                        }
                        return [4 /*yield*/, Promise.reject(res.data)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        logger_1.default.error("error making http request: ".concat(e_1.message));
                        return [2 /*return*/, Promise.reject((0, ramda_1.pathOr)(e_1.message, ['response', 'data'], e_1))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Request;
}());
exports.Request = Request;
//# sourceMappingURL=request.js.map