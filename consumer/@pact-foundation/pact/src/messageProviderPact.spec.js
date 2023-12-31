"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression no-empty */
var chai = __importStar(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var express_1 = __importDefault(require("express"));
var http = __importStar(require("http"));
var messageProviderPact_1 = require("./messageProviderPact");
chai.use(sinon_chai_1.default);
chai.use(chai_as_promised_1.default);
var expect = chai.expect;
describe('MesageProvider', function () {
    var provider;
    var successfulRequest = 'successfulRequest';
    var unsuccessfulRequest = 'unsuccessfulRequest';
    var successfulMessage = {
        contents: { foo: 'bar' },
        description: successfulRequest,
        providerStates: [{ name: 'some state' }],
    };
    var unsuccessfulMessage = {
        contents: { foo: 'bar' },
        description: unsuccessfulRequest,
        providerStates: [{ name: 'some state not found' }],
    };
    var nonExistentMessage = {
        contents: { foo: 'bar' },
        description: 'does not exist',
        providerStates: [{ name: 'some state not found' }],
    };
    beforeEach(function () {
        provider = new messageProviderPact_1.MessageProviderPact({
            logLevel: 'error',
            messageProviders: {
                successfulRequest: function () { return Promise.resolve('yay'); },
                unsuccessfulRequest: function () { return Promise.reject(new Error('nay')); },
            },
            provider: 'myprovider',
            stateHandlers: {
                'some state': function () { return Promise.resolve('yay'); },
                'some state with params': function (name, params) {
                    return Promise.resolve("name: ".concat(name, ", params: ").concat(JSON.stringify(params)));
                },
            },
        });
    });
    describe('#constructor', function () {
        it('creates a Provider when all mandatory parameters are provided', function () {
            expect(provider).to.be.a('object');
            expect(provider).to.respondTo('verify');
        });
        it('creates a Provider with default log level if not specified', function () {
            provider = new messageProviderPact_1.MessageProviderPact({
                messageProviders: {},
                provider: 'myprovider',
            });
            expect(provider).to.be.a('object');
            expect(provider).to.respondTo('verify');
        });
    });
    describe('#setupVerificationHandler', function () {
        describe('when their is a valid setup', function () {
            it('creates a valid express handler', function (done) {
                var setupVerificationHandler = provider.setupVerificationHandler.bind(provider)();
                var req = { body: successfulMessage };
                var res = {
                    json: function () { return done(); }, // Expect a response
                };
                setupVerificationHandler(req, res);
            });
        });
        describe('when their is an invalid setup', function () {
            it('creates a valid express handler that rejects the message', function (done) {
                var setupVerificationHandler = provider.setupVerificationHandler.bind(provider)();
                var req = { body: nonExistentMessage };
                var res = {
                    status: function (status) {
                        expect(status).to.eq(500);
                        return {
                            send: function () { return done(); }, // Expect the status to be called with 500
                        };
                    },
                };
                setupVerificationHandler(req, res);
            });
        });
    });
    describe('#findHandler', function () {
        describe('when given a handler that exists', function () {
            it('returns a Handler object', function () {
                var findHandler = provider.findHandler.bind(provider);
                return expect(findHandler(successfulMessage)).to.eventually.be.a('function');
            });
        });
        describe('when given a handler that does not exist', function () {
            it('returns a failed promise', function () {
                var findHandler = provider.findHandler.bind(provider);
                return expect(findHandler('doesnotexist')).to.eventually.be.rejected;
            });
        });
    });
    describe('#setupStates', function () {
        describe('when given a handler that exists', function () {
            it('returns values of all resolved handlers', function () {
                var setupStates = provider.setupStates.bind(provider);
                return expect(setupStates(successfulMessage)).to.eventually.deep.equal([
                    'yay',
                ]);
            });
            it('passes params to the handler', function () {
                var setupStates = provider.setupStates.bind(provider);
                return expect(setupStates({
                    providerStates: [
                        { name: 'some state with params', params: { foo: 'bar' } },
                    ],
                })).to.eventually.deep.equal([
                    'name: some state with params, params: {"foo":"bar"}',
                ]);
            });
        });
        describe('when given a state that does not have a handler', function () {
            it('returns an empty promise', function () {
                provider = new messageProviderPact_1.MessageProviderPact({
                    messageProviders: {},
                    provider: 'myprovider',
                });
                var findStateHandler = provider.setupStates.bind(provider);
                return expect(findStateHandler(unsuccessfulMessage)).to.eventually.deep.equal([]);
            });
        });
    });
    describe('#waitForServerReady', function () {
        describe('when the http server starts up', function () {
            it('returns a resolved promise', function () {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                var server = http.createServer(function () { }).listen();
                return expect((0, messageProviderPact_1.waitForServerReady)(server)).to.eventually.be.fulfilled;
            });
        });
    });
    describe('#setupProxyServer', function () {
        describe('when the http server starts up', function () {
            it('returns a resolved promise', function () {
                var app = (0, express_1.default)();
                expect((0, messageProviderPact_1.setupProxyServer)(app)).to.be.an.instanceOf(http.Server);
            });
        });
    });
    describe('#setupProxyApplication', function () {
        it('returns a valid express app', function () {
            var setupProxyApplication = provider.setupProxyApplication.bind(provider);
            expect(setupProxyApplication().listen).to.be.a('function');
        });
    });
});
//# sourceMappingURL=messageProviderPact.spec.js.map