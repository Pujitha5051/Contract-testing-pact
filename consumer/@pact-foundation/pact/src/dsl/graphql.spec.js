"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var graphql_1 = require("./graphql");
var matchers_1 = require("./matchers");
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('GraphQLInteraction', function () {
    var interaction;
    beforeEach(function () {
        interaction = new graphql_1.GraphQLInteraction();
    });
    describe('#withOperation', function () {
        describe('when given a valid operation', function () {
            it('creates a GraphQL Interaction', function () {
                interaction.uponReceiving('a request');
                interaction.withRequest({
                    path: '/graphql',
                    method: 'POST',
                });
                interaction.withOperation('query');
                interaction.withQuery('{ hello }');
                interaction.willRespondWith({
                    status: 200,
                    body: { data: {} },
                });
                var json = interaction.json();
                expect(json.request.body.operationName).to.eq('query');
            });
        });
        describe('when given an invalid operation', function () {
            it('fails with an error', function () {
                expect(interaction.withOperation.bind('aoeu')).to.throw(Error);
            });
        });
        describe('when given a null operation', function () {
            it('creates a GrphQL Interaction', function () {
                interaction.uponReceiving('a request');
                interaction.withRequest({
                    path: '/graphql',
                    method: 'POST',
                });
                interaction.withOperation(null);
                interaction.withQuery('{ hello }');
                interaction.willRespondWith({
                    status: 200,
                    body: { data: {} },
                });
                var json = interaction.json();
                expect(json.request.body.operationName).to.eq(null);
            });
        });
    });
    describe('#withVariables', function () {
        describe('when given a set of variables', function () {
            it('adds the variables to the payload', function () {
                interaction.uponReceiving('a request');
                interaction.withRequest({
                    path: '/graphql',
                    method: 'POST',
                });
                interaction.withOperation('query');
                interaction.withQuery('{ hello }');
                interaction.withVariables({
                    foo: 'bar',
                });
                interaction.willRespondWith({
                    status: 200,
                    body: { data: {} },
                });
                var json = interaction.json();
                expect(json.request.body.variables).to.deep.eq({ foo: 'bar' });
            });
        });
        describe('when no variables are provided', function () {
            it('does not add the variables property to the payload', function () {
                interaction.uponReceiving('a request');
                interaction.withRequest({
                    path: '/graphql',
                    method: 'POST',
                });
                interaction.withOperation('query');
                interaction.withQuery('{ hello }');
                interaction.willRespondWith({
                    status: 200,
                    body: { data: {} },
                });
                var json = interaction.json();
                expect(json.request.body).to.not.have.property('variables');
            });
        });
        describe('when an empty variables object is presented', function () {
            it('adds the variables property to the payload', function () {
                interaction.uponReceiving('a request');
                interaction.withRequest({
                    path: '/graphql',
                    method: 'POST',
                });
                interaction.withOperation('query');
                interaction.withQuery('{ hello }');
                interaction.withVariables({});
                interaction.willRespondWith({
                    status: 200,
                    body: { data: {} },
                });
                var json = interaction.json();
                expect(json.request.body).to.have.property('variables');
            });
        });
    });
    describe('#withQuery', function () {
        beforeEach(function () {
            interaction.uponReceiving('a request');
            interaction.withRequest({
                path: '/graphql',
                method: 'POST',
            });
            interaction.withOperation('query');
            interaction.withQuery('{ hello }');
            interaction.withVariables({
                foo: 'bar',
            });
            interaction.willRespondWith({
                status: 200,
                body: { data: {} },
            });
        });
        describe('when given an empty query', function () {
            it('fails with an error', function () {
                expect(function () { return interaction.withQuery(null); }).to.throw();
            });
        });
        describe('when given an invalid query', function () {
            it('fails with an error', function () {
                expect(function () {
                    return interaction.withQuery('{ not properly terminated');
                }).to.throw(Error);
            });
        });
        describe('when given a valid query', function () {
            describe('without variables', function () {
                it('adds regular expressions for the whitespace in the query', function () {
                    interaction.uponReceiving('a request');
                    interaction.withRequest({
                        path: '/graphql',
                        method: 'POST',
                    });
                    interaction.withOperation('query');
                    interaction.withQuery('{ hello }');
                    interaction.willRespondWith({
                        status: 200,
                        body: { data: {} },
                    });
                    var json = interaction.json();
                    expect((0, matchers_1.isMatcher)(json.request.body.query)).to.eq(true);
                    var r = new RegExp(json.request.body.query.regex, 'g');
                    var lotsOfWhitespace = "{             hello\n\n        }";
                    expect(r.test(lotsOfWhitespace)).to.eq(true);
                });
            });
            describe('and variables', function () {
                it('adds regular expressions for the whitespace in the query', function () {
                    interaction.withQuery("{\n            Hello(id: $id) {\n              name\n            }\n          }");
                    interaction.withVariables({
                        name: 'bar',
                    });
                    var json = interaction.json();
                    expect((0, matchers_1.isMatcher)(json.request.body.query)).to.eq(true);
                    var r = new RegExp(json.request.body.query.regex, 'g');
                    // eslint-disable-next-line no-useless-escape
                    var lotsOfWhitespace = "{             Hello(id: $id) { name    } }";
                    expect(r.test(lotsOfWhitespace)).to.eq(true);
                });
            });
        });
    });
    describe('#json', function () {
        context('when query is empty', function () {
            it('fails with an error', function () {
                expect(function () { return interaction.json(); }).to.throw();
            });
        });
        context('when description is empty', function () {
            it('fails with an error', function () {
                interaction.withQuery('{ hello }');
                return expect(function () { return interaction.json(); }).to.throw();
            });
        });
        describe('when no operation is provided', function () {
            it('does not be present in unmarshaled body', function () {
                interaction.uponReceiving('a request');
                interaction.withRequest({
                    path: '/graphql',
                    method: 'POST',
                });
                interaction.withQuery('{ hello }');
                interaction.willRespondWith({
                    status: 200,
                    body: { data: {} },
                });
                var json = interaction.json();
                expect(json.request.body).to.not.have.property('operationName');
            });
        });
    });
    context('when given a valid query', function () {
        it('marshals the query to JSON', function () {
            interaction.uponReceiving('a request');
            interaction.withRequest({
                path: '/graphql',
                method: 'POST',
            });
            interaction.withOperation('query');
            interaction.withQuery('{ hello }');
            interaction.willRespondWith({
                status: 200,
                body: { data: {} },
            });
            var json = interaction.json();
            expect((0, matchers_1.isMatcher)(json.request.body.query)).to.eq(true);
            expect(json.request.body.query.getValue()).to.eq('{ hello }');
        });
    });
});
//# sourceMappingURL=graphql.spec.js.map