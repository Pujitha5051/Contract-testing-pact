"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_1 = __importDefault(require("sinon"));
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var ffi_1 = require("./ffi");
chai_1.default.use(sinon_chai_1.default);
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('Pact FFI', function () {
    describe('#contentTypeFromHeaders', function () {
        ['content-type', 'Content-Type', 'CONTent-TYPE'].forEach(function (t) {
            describe("when the \"".concat(t, "\" header is set"), function () {
                it('detects the content type from the header', function () {
                    var _a;
                    var headers = (_a = {}, _a[t] = 'some-mime-type', _a);
                    expect((0, ffi_1.contentTypeFromHeaders)(headers, 'application/json')).to.eq('some-mime-type');
                });
            });
        });
        describe("when the no content-type header is set", function () {
            it('uses a default', function () {
                expect((0, ffi_1.contentTypeFromHeaders)({}, 'application/json')).to.eq('application/json');
            });
        });
    });
    describe('#setQuery', function () {
        describe('with array values', function () {
            it('calls the query ffi function for each value', function () {
                var queryMock = sinon_1.default.stub();
                var interaction = {
                    withQuery: queryMock,
                };
                var query = {
                    foo: ['bar', 'baz'],
                };
                (0, ffi_1.setQuery)(interaction, query);
                expect(queryMock.calledTwice);
                expect(queryMock.calledWith('foo', 0, 'bar'));
                expect(queryMock.calledWith('foo', 1, 'baz'));
            });
        });
        describe('with single values', function () {
            it('calls the query ffi function for each value', function () {
                var queryMock = sinon_1.default.stub();
                var interaction = {
                    withQuery: queryMock,
                };
                var query = {
                    foo: 'bar',
                };
                (0, ffi_1.setQuery)(interaction, query);
                expect(queryMock.calledOnce);
                expect(queryMock.calledWith('foo', 0, 'bar'));
            });
        });
        describe('with array and single values', function () {
            it('calls the query ffi function for each value', function () {
                var queryMock = sinon_1.default.stub();
                var interaction = {
                    withQuery: queryMock,
                };
                var query = {
                    foo: 'bar',
                    baz: ['bat', 'foo'],
                };
                (0, ffi_1.setQuery)(interaction, query);
                expect(queryMock.calledThrice);
                expect(queryMock.calledWith('foo', 0, 'bar'));
                expect(queryMock.calledWith('baz', 0, 'bat'));
                expect(queryMock.calledWith('baz', 1, 'foo'));
            });
        });
    });
});
//# sourceMappingURL=ffi.spec.js.map