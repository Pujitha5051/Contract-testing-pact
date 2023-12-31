"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var request_1 = require("../common/request");
var interaction_1 = require("./interaction");
var matchers_1 = require("./matchers");
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('Interaction', function () {
    describe('#given', function () {
        it('creates Interaction with provider state', function () {
            var actual = new interaction_1.Interaction()
                .uponReceiving('r')
                .given('provider state');
            expect(actual.state).to.eql({
                description: 'r',
                providerState: 'provider state',
            });
        });
        describe('without provider state', function () {
            it('creates Interaction when blank', function () {
                var actual = new interaction_1.Interaction().uponReceiving('r').given('').state;
                expect(actual).to.eql({ description: 'r' });
            });
            it('creates Interaction when nothing is passed', function () {
                var actual = new interaction_1.Interaction().uponReceiving('r').state;
                expect(actual).to.eql({ description: 'r' });
            });
        });
    });
    describe('#uponReceiving', function () {
        var interaction = new interaction_1.Interaction();
        it('throws error when no description provided', function () {
            expect(interaction.uponReceiving).to.throw(Error, 'You must provide a description for the interaction.');
        });
        it('has a state with description', function () {
            interaction.uponReceiving('an interaction description');
            expect(interaction.state).to.eql({
                description: 'an interaction description',
            });
        });
    });
    describe('#withRequest', function () {
        var interaction = new interaction_1.Interaction();
        it('throws error when method is not provided', function () {
            expect(interaction.withRequest.bind(interaction, {})).to.throw(Error, 'You must provide an HTTP method.');
        });
        it('throws error when an invalid method is provided', function () {
            expect(interaction.withRequest.bind(interaction, { method: 'FOO' })).to.throw(Error, 'You must provide a valid HTTP method: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, COPY, LOCK, MKCOL, MOVE, PROPFIND, PROPPATCH, UNLOCK, REPORT.');
        });
        it('throws error when method is not provided', function () {
            expect(interaction.withRequest.bind(interaction, { path: '/' })).to.throw(Error, 'You must provide an HTTP method.');
        });
        it('throws error when path is not provided', function () {
            expect(interaction.withRequest.bind(interaction, { method: request_1.HTTPMethods.GET })).to.throw(Error, 'You must provide a path.');
        });
        it('throws error when query object is not a string', function () {
            expect(interaction.withRequest.bind(interaction, {
                method: request_1.HTTPMethods.GET,
                path: '/',
                query: { string: false, query: 'false' },
            })).to.throw(Error, 'Query must only contain strings.');
        });
        describe('with only mandatory params', function () {
            var actual = new interaction_1.Interaction()
                .uponReceiving('a request')
                .withRequest({ method: request_1.HTTPMethods.GET, path: '/search' }).state;
            it('has a state containing only the given keys', function () {
                expect(actual).to.have.property('request');
                expect(actual.request).to.have.keys('method', 'path');
            });
            it('request has no other keys', function () {
                expect(actual.request).to.not.have.keys('query', 'headers', 'body');
            });
        });
        describe('with all other parameters', function () {
            var actual = new interaction_1.Interaction().uponReceiving('request').withRequest({
                body: { id: 1, name: 'Test', due: 'tomorrow' },
                headers: { 'Content-Type': 'application/json' },
                method: request_1.HTTPMethods.GET,
                path: '/search',
                query: 'q=test',
            }).state;
            it('has a full state all available keys', function () {
                expect(actual).to.have.property('request');
                expect(actual.request).to.have.keys('method', 'path', 'query', 'headers', 'body');
            });
        });
        describe('query type', function () {
            var request = {
                body: { id: 1, name: 'Test', due: 'tomorrow' },
                headers: { 'Content-Type': 'application/json' },
                method: request_1.HTTPMethods.GET,
                path: '/search',
                query: {},
            };
            it('is passed with matcher', function () {
                request.query = (0, matchers_1.term)({
                    generate: 'limit=50&status=finished&order=desc',
                    matcher: '^limit=[0-9]+&status=(finished)&order=(desc|asc)$',
                });
                expect(new interaction_1.Interaction().uponReceiving('request').withRequest(request).state
                    .request).to.have.any.keys('query');
            });
            it('is passed with matcher as the value', function () {
                request.query = {
                    'id[]': (0, matchers_1.eachLike)('1'),
                };
                expect(new interaction_1.Interaction().uponReceiving('request').withRequest(request).state
                    .request).to.have.any.keys('query');
            });
            it('is passed with object', function () {
                request.query = {
                    id: '1',
                };
                expect(new interaction_1.Interaction().uponReceiving('request').withRequest(request).state
                    .request).to.have.any.keys('query');
            });
            it('is passed with array', function () {
                var _a;
                request.query = {
                    id: ['1', '2'],
                };
                expect((_a = new interaction_1.Interaction().uponReceiving('request').withRequest(request).state
                    .request) === null || _a === void 0 ? void 0 : _a.query).to.deep.eq({ id: ['1', '2'] });
            });
        });
        describe('request body', function () {
            it('is included when an empty string is specified', function () {
                var actual = new interaction_1.Interaction().uponReceiving('request').withRequest({
                    body: '',
                    method: request_1.HTTPMethods.GET,
                    path: '/path',
                }).state;
                expect(actual.request).to.have.any.keys('body');
            });
            it('is not included when explicitly set to undefined', function () {
                var actual = new interaction_1.Interaction().uponReceiving('request').withRequest({
                    body: undefined,
                    method: request_1.HTTPMethods.GET,
                    path: '/path',
                }).state;
                expect(actual.request).not.to.have.any.keys('body');
            });
        });
    });
    describe('#willRespondWith', function () {
        var interaction;
        beforeEach(function () {
            interaction = new interaction_1.Interaction();
        });
        it('throws error when status is not provided', function () {
            expect(interaction.willRespondWith.bind(interaction, {})).to.throw(Error, 'You must provide a status code.');
        });
        it('throws error when status is blank', function () {
            expect(interaction.willRespondWith.bind(interaction, { status: '' })).to.throw(Error, 'You must provide a status code.');
        });
        describe('with only mandatory params', function () {
            var actual;
            beforeEach(function () {
                interaction.uponReceiving('request');
                interaction.willRespondWith({ status: 200 });
                actual = interaction.state;
            });
            it('has a state compacted with only present keys', function () {
                expect(actual).to.have.property('response');
                expect(actual.response).to.have.keys('status');
            });
            it('request has no other keys', function () {
                expect(actual.response).to.not.have.keys('headers', 'body');
            });
        });
        describe('with all other parameters', function () {
            var actual;
            beforeEach(function () {
                interaction.uponReceiving('request');
                interaction.willRespondWith({
                    body: { id: 1, name: 'Test', due: 'tomorrow' },
                    headers: { 'Content-Type': 'application/json' },
                    status: 404,
                });
                actual = interaction.state;
            });
            it('has a full state all available keys', function () {
                expect(actual).to.have.property('response');
                expect(actual.response).to.have.keys('status', 'headers', 'body');
            });
        });
        describe('response body', function () {
            it('is included when an empty string is specified', function () {
                interaction.uponReceiving('request').willRespondWith({
                    body: '',
                    status: 204,
                });
                var actual = interaction.state;
                expect(actual.response).to.have.any.keys('body');
            });
            it('is not included when explicitly set to undefined', function () {
                interaction.uponReceiving('request').willRespondWith({
                    body: undefined,
                    status: 204,
                });
                var actual = interaction.state;
                expect(actual.response).not.to.have.any.keys('body');
            });
        });
    });
});
//# sourceMappingURL=interaction.spec.js.map