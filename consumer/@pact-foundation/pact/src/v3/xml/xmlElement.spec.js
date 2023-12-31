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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var chai = __importStar(require("chai"));
var mocha_1 = require("mocha");
var xmlText_1 = require("./xmlText");
var xmlElement_1 = require("./xmlElement");
var MatchersV3 = __importStar(require("../matchers"));
var expect = chai.expect;
(0, mocha_1.describe)('xml element', function () {
    (0, mocha_1.describe)('appendText', function () {
        it('can be called with a string', function () {
            var xml = new xmlElement_1.XmlElement('my name')
                .appendText('some string')
                .appendText('second string');
            expect(xml, 'XML element').to.have.property('name');
            expect(xml.name, 'name of XML element').to.equal('my name');
            expect(xml, 'XML element').to.have.property('children');
            expect(xml.children, 'children of XML element').to.be.lengthOf(2);
            expect(xml.children[0], 'type of first child of XML element').to.be.instanceOf(xmlText_1.XmlText);
            expect(xml.children[0], 'first child of XML element').to.have.property('content');
            expect(xml.children[0].content, 'content of first child').to.equal('some string');
            expect(xml.children[0], 'first child of XML element').to.have.property('matcher');
            expect(xml.children[0].matcher, 'matcher of the first child').to.be
                .undefined;
        });
        it('can be called with a Matcher', function () {
            var xml = new xmlElement_1.XmlElement('my name')
                .appendText(MatchersV3.string('string matcher'))
                .appendText(MatchersV3.regex(/^.*$/, 'regex matcher'))
                .appendText(MatchersV3.date('yyyy-MM-dd HH:mm:ss.SSSX', '2016-02-11T09:46:56.023Z'))
                .appendText(MatchersV3.datetime('yyyy-MM-dd HH:mm:ss.SSSX', '2016-02-11T09:46:56.023Z'))
                .appendText(MatchersV3.timestamp('yyyy-MM-dd HH:mm:ss.SSSX', '2016-02-11T09:46:56.023Z'))
                .appendText(MatchersV3.time('yyyy-MM-dd HH:mm:ss.SSSX', '2016-02-11T09:46:56.023Z'))
                .appendText(MatchersV3.uuid('adc214d3-1c9f-460d-b6c8-8f2bc8911860'));
            expect(xml, 'XML element').to.have.property('name');
            expect(xml.name, 'name of XML element').to.equal('my name');
            expect(xml, 'XML element').to.have.property('children');
            expect(xml.children, 'children of XML element').to.be.lengthOf(7);
            for (var i = 0; i < 7; i += 1) {
                expect(xml.children[i]).to.be.instanceOf(xmlText_1.XmlText);
                expect(xml.children[i]).to.have.property('content');
                expect(xml.children[i].content).not.to.be.empty;
                expect(xml.children[i].content).to.be.a('string');
                expect(xml.children[i]).to.have.property('matcher');
                expect(xml.children[i].matcher).to.have.property('value');
                expect(xml.children[i].matcher.value).to.be.a('string');
                expect(xml.children[i].matcher.value).not.to.be.empty;
                expect(xml.children[i].matcher).to.have.property('pact:matcher:type');
                expect(xml.children[i].matcher['pact:matcher:type']).to.be.a('string');
                expect(xml.children[i].matcher['pact:matcher:type']).not.to.be.empty;
            }
        });
        it('sets content to an empty string if the Matcher has no value', function () {
            function noValueMatcher() {
                return {
                    'pact:matcher:type': 'no-value',
                };
            }
            var xml = new xmlElement_1.XmlElement('my name').appendText(noValueMatcher());
            expect(xml, 'XML element').to.have.property('name');
            expect(xml.name, 'name of XML element').to.equal('my name');
            expect(xml, 'XML element').to.have.property('children');
            expect(xml.children, 'children of XML element').to.be.lengthOf(1);
            expect(xml.children[0]).to.be.instanceOf(xmlText_1.XmlText);
            expect(xml.children[0]).to.have.property('content');
            expect(xml.children[0].content).to.be.empty;
            expect(xml.children[0].content).to.be.a('string');
            expect(xml.children[0]).to.have.property('matcher');
            expect(xml.children[0].matcher).not.to.have.property('value');
            expect(xml.children[0].matcher).to.have.property('pact:matcher:type');
            expect(xml.children[0].matcher['pact:matcher:type']).to.be.a('string');
            expect(xml.children[0].matcher['pact:matcher:type']).not.to.be.empty;
        });
    });
});
//# sourceMappingURL=xmlElement.spec.js.map