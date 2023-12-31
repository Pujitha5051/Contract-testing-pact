"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression no-empty */
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var messageConsumerPact_1 = require("./messageConsumerPact");
chai_1.default.use(sinon_chai_1.default);
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('MessageConsumer', function () {
    var consumer;
    beforeEach(function () {
        consumer = new messageConsumerPact_1.MessageConsumerPact({
            consumer: 'myconsumer',
            provider: 'myprovider',
        });
    });
    var testMessage = {
        contents: {
            foo: 'bar',
        },
    };
    describe('#constructor', function () {
        it('creates a Consumer when all mandatory parameters are provided', function () {
            expect(consumer).to.be.a('object');
            expect(consumer).to.respondTo('verify');
        });
    });
    describe('#dsl', function () {
        describe('when an empty description has been given', function () {
            it('it should throw an error', function () {
                expect(function () {
                    consumer.expectsToReceive('');
                }).to.throw(Error);
            });
        });
        describe('when an empty content object has been given', function () {
            it('it should throw an error', function () {
                expect(function () {
                    consumer.withContent({});
                }).to.throw(Error);
            });
        });
        describe('when an empty metadata object has been given', function () {
            it('it should throw an error', function () {
                expect(function () {
                    consumer.withMetadata({});
                }).to.throw(Error);
            });
        });
    });
    describe('#verify', function () {
        describe('when given a valid handler and message', function () {
            it('verifies the consumer message', function () {
                var stubbedConsumer = new messageConsumerPact_1.MessageConsumerPact({
                    consumer: 'myconsumer',
                    provider: 'myprovider',
                });
                var stub = stubbedConsumer;
                // Stub out service factory
                stub.getServiceFactory = function () { return ({
                    createMessage: function () { return Promise.resolve('message created'); },
                }); };
                stubbedConsumer
                    .given('some state')
                    .expectsToReceive('A message about something')
                    .withContent({ foo: 'bar' })
                    .withMetadata({ baz: 'bat' });
                return expect(stubbedConsumer.verify(function () { return Promise.resolve('yay!'); })).to
                    .eventually.be.fulfilled;
            });
        });
    });
    describe('handler transformers', function () {
        describe('#asynchronousbodyHandler', function () {
            describe('when given a function that succeeds', function () {
                it('returns a Handler object that returns a completed promise', function () {
                    var failFn = function () { return Promise.resolve('yay!'); };
                    var hFn = (0, messageConsumerPact_1.asynchronousBodyHandler)(failFn);
                    return expect(hFn(testMessage)).to.eventually.be.fulfilled;
                });
            });
            describe('when given a function that throws an Exception', function () {
                it('returns a Handler object that returns a rejected promise', function () {
                    var failFn = function () { return Promise.reject(new Error('fail')); };
                    var hFn = (0, messageConsumerPact_1.asynchronousBodyHandler)(failFn);
                    return expect(hFn(testMessage)).to.eventually.be.rejected;
                });
            });
        });
        describe('#synchronousbodyHandler', function () {
            describe('when given a function that succeeds', function () {
                it('returns a Handler object that returns a completed promise', function () {
                    var failFn = function () {
                        /* do nothing! */
                    };
                    var hFn = (0, messageConsumerPact_1.synchronousBodyHandler)(failFn);
                    return expect(hFn(testMessage)).to.eventually.be.fulfilled;
                });
            });
            describe('when given a function that throws an Exception', function () {
                it('returns a Handler object that returns a rejected promise', function () {
                    var failFn = function () {
                        throw new Error('fail');
                    };
                    var hFn = (0, messageConsumerPact_1.synchronousBodyHandler)(failFn);
                    return expect(hFn(testMessage)).to.eventually.be.rejected;
                });
            });
        });
    });
});
//# sourceMappingURL=messageConsumerPact.spec.js.map