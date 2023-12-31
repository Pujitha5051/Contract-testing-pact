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
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_1 = __importDefault(require("sinon"));
var logger_1 = __importDefault(require("../../../../common/logger"));
var setupStates_1 = require("./setupStates");
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('#setupStates', function () {
    var state = {
        state: 'thing exists',
        action: 'setup',
        params: {},
    };
    var state2 = {
        state: 'another thing exists',
        action: 'setup',
        params: {
            id: 1,
        },
    };
    var providerBaseUrl = 'http://not.exists';
    var executed;
    var setup;
    var teardown;
    var DEFAULT_OPTIONS = function () {
        var _a;
        return ({
            providerBaseUrl: providerBaseUrl,
            requestFilter: function (req, res, next) {
                next();
            },
            stateHandlers: (_a = {},
                _a[state.state] = function () {
                    executed = true;
                    return Promise.resolve({});
                },
                _a[state2.state] = {
                    setup: function (params) {
                        setup = true;
                        return Promise.resolve(params);
                    },
                    teardown: function (params) {
                        teardown = true;
                        return Promise.resolve(params);
                    },
                },
                _a),
        });
    };
    var opts;
    beforeEach(function () {
        opts = DEFAULT_OPTIONS();
        executed = false;
        setup = false;
        teardown = false;
    });
    describe('when there are provider states on the pact', function () {
        describe('and there are handlers associated with those states', function () {
            describe('that return provider state injected values', function () {
                it('executes the handler and returns the data', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var res;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                opts.stateHandlers = (_a = {},
                                    _a[state.state] = function () {
                                        executed = true;
                                        return Promise.resolve({ data: true });
                                    },
                                    _a);
                                return [4 /*yield*/, (0, setupStates_1.setupStates)(state, opts)];
                            case 1:
                                res = _b.sent();
                                expect(res).to.have.property('data', true);
                                expect(executed).to.be.true;
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('that do not return a value', function () {
                it('executes the handler and returns an empty Promise', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, setupStates_1.setupStates)(state, opts)];
                            case 1:
                                _a.sent();
                                expect(executed).to.be.true;
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('that specify a setup and teardown function', function () {
                it('executes the lifecycle specific handler and returns any provider state injected values', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var res, res2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, setupStates_1.setupStates)(state2, opts)];
                            case 1:
                                res = _a.sent();
                                expect(res).to.eq(state2.params);
                                expect(setup).to.be.true;
                                expect(teardown).to.be.false;
                                setup = false;
                                return [4 /*yield*/, (0, setupStates_1.setupStates)(__assign(__assign({}, state2), { action: 'teardown' }), opts)];
                            case 2:
                                res2 = _a.sent();
                                expect(res2).to.eq(state2.params);
                                expect(teardown).to.be.true;
                                expect(setup).to.be.false;
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('and there are no handlers associated with those states', function () {
            it('does not execute the handler and returns an empty Promise', function () { return __awaiter(void 0, void 0, void 0, function () {
                var spy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            spy = sinon_1.default.spy(logger_1.default, 'warn');
                            delete opts.stateHandlers;
                            return [4 /*yield*/, (0, setupStates_1.setupStates)(state, opts)];
                        case 1:
                            _a.sent();
                            expect(spy.callCount).to.eql(1);
                            expect(executed).to.be.false;
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=setupStates.spec.js.map