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
// @ts-nocheck
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_1 = __importDefault(require("sinon"));
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var _1 = require(".");
chai_1.default.use(sinon_chai_1.default);
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('Pact', function () {
    var fullOpts = {
        consumer: 'A',
        provider: 'B',
        port: 1234,
        host: '127.0.0.1',
        ssl: false,
        logLevel: 'info',
        spec: 2,
        cors: false,
        pactfileWriteMode: 'merge',
    };
    afterEach(function () {
        sinon_1.default.restore();
    });
    describe('#constructor', function () {
        it('throws Error when consumer not provided', function () {
            expect(function () {
                new _1.Pact({ consumer: '', provider: 'provider' });
            }).to.throw(Error, 'You must specify a Consumer for this pact.');
        });
        it('throws Error when provider not provided', function () {
            expect(function () {
                new _1.Pact({ consumer: 'someconsumer', provider: '' });
            }).to.throw(Error, 'You must specify a Provider for this pact.');
        });
    });
    describe('#createOptionsWithDefault', function () {
        var constructorOpts = {
            consumer: 'A',
            provider: 'B',
        };
        it('merges options with sensible defaults', function () {
            var opts = _1.Pact.createOptionsWithDefaults(constructorOpts);
            expect(opts.consumer).to.eq('A');
            expect(opts.provider).to.eq('B');
            expect(opts.cors).to.eq(false);
            expect(opts.host).to.eq('127.0.0.1');
            expect(opts.logLevel).to.eq('info');
            expect(opts.spec).to.eq(2);
            expect(opts.dir).not.to.be.empty;
            expect(opts.log).not.to.be.empty;
            expect(opts.pactfileWriteMode).to.eq('merge');
            expect(opts.ssl).to.eq(false);
            expect(opts.sslcert).to.eq(undefined);
            expect(opts.sslkey).to.eq(undefined);
        });
    });
    describe('#setup', function () {
        describe('when server is properly configured', function () {
            it('updates the mock service configuration', function () { return __awaiter(void 0, void 0, void 0, function () {
                var p;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            p = new _1.Pact(fullOpts);
                            return [4 /*yield*/, p.setup()];
                        case 1:
                            _a.sent();
                            expect(p.mockService).to.deep.equal({
                                baseUrl: 'http://127.0.0.1:1234',
                                pactDetails: {
                                    pactfile_write_mode: 'merge',
                                    consumer: {
                                        name: 'A',
                                    },
                                    provider: { name: 'B' },
                                },
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the current configuration', function () {
                var p = new _1.Pact(fullOpts);
                return expect(p.setup()).to.eventually.include({
                    consumer: 'A',
                    provider: 'B',
                    port: 1234,
                    host: '127.0.0.1',
                    ssl: false,
                    logLevel: 'info',
                    spec: 2,
                    cors: false,
                    pactfileWriteMode: 'merge',
                });
            });
        });
        describe('when a port is given', function () {
            it('checks if the port is available', function () {
                var p = new _1.Pact(fullOpts);
                return expect(p.setup())
                    .to.eventually.have.property('port')
                    .eq(fullOpts.port);
            });
        });
        describe('when no port is given', function () {
            it('finds a free port', function () {
                var opts = __assign(__assign({}, fullOpts), { port: undefined });
                var p = new _1.Pact(opts);
                return expect(p.setup()).to.eventually.have.property('port').not
                    .undefined;
            });
        });
    });
    describe('#addInteraction', function () {
        // This is more of an integration test, as the function has taken on a lot more
        // responsibility previously covered by other functions during the upgrade to
        // the rust core, to ensure the API remains backwards compatible
        it('sets the correct request and response details on the FFI and starts the mock server', function () {
            var p = new _1.Pact(fullOpts);
            var uponReceiving = sinon_1.default.stub().returns(true);
            var given = sinon_1.default.stub().returns(true);
            var withRequest = sinon_1.default.stub().returns(true);
            var withRequestBody = sinon_1.default.stub().returns(true);
            var withRequestHeader = sinon_1.default.stub().returns(true);
            var withQuery = sinon_1.default.stub().returns(true);
            var withResponseBody = sinon_1.default.stub().returns(true);
            var withResponseHeader = sinon_1.default.stub().returns(true);
            var withStatus = sinon_1.default.stub().returns(true);
            var createMockServer = sinon_1.default.stub().returns(1234);
            var pactMock = {
                createMockServer: createMockServer,
            };
            var interactionMock = {
                uponReceiving: uponReceiving,
                given: given,
                withRequest: withRequest,
                withRequestBody: withRequestBody,
                withRequestHeader: withRequestHeader,
                withQuery: withQuery,
                withResponseBody: withResponseBody,
                withResponseHeader: withResponseHeader,
                withStatus: withStatus,
            };
            p.pact = pactMock;
            p.interaction = interactionMock;
            p.mockService = {};
            p.addInteraction({
                state: 'some state',
                uponReceiving: 'some description',
                withRequest: {
                    method: 'GET',
                    path: '/',
                    body: { foo: 'bar' },
                    headers: {
                        'content-type': 'application/json',
                        foo: 'bar',
                    },
                    query: {
                        query: 'string',
                        foo: 'bar',
                    },
                },
                willRespondWith: {
                    status: 200,
                    body: { baz: 'bat' },
                    headers: {
                        'content-type': 'application/hal+json',
                        foo: 'bar',
                    },
                },
            });
            expect(uponReceiving.calledOnce).to.be.true;
            expect(given.calledOnce).to.be.true;
            expect(withRequest.calledOnce).to.be.true;
            expect(withQuery.calledTwice).to.be.true;
            expect(withRequestHeader.calledTwice).to.be.true;
            expect(withRequestBody.calledOnce).to.be.true;
            expect(withResponseBody.calledOnce).to.be.true;
            expect(withResponseHeader.calledTwice).to.be.true;
            // Pact mock server started
            expect(createMockServer.called).to.be.true;
        });
    });
});
//# sourceMappingURL=index.spec.js.map