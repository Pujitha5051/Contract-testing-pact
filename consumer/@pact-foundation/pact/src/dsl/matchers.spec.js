"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-function */
var chai_1 = require("chai");
var matchers_1 = require("./matchers");
describe('Matcher', function () {
    describe('can compile the types', function () {
        describe('with interfaces', function () {
            it('compiles when InterfaceToTemplate is used', function () {
                var template = {
                    someArray: ['one', 'two'],
                    someNumber: 1,
                    someString: "it's a string",
                    someObject: {
                        foo: 'some string',
                        bar: 'some other string',
                    },
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
                var a = (0, matchers_1.like)(template);
            });
        });
        describe('with types', function () {
            it('compiles', function () {
                var template = {
                    someArray: ['one', 'two'],
                    someNumber: 1,
                    someString: "it's a string",
                    someObject: {
                        foo: 'some string',
                        bar: 'some other string',
                    },
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
                var a = (0, matchers_1.like)(template);
            });
        });
        it('compiles nested likes', function () {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
            var a = (0, matchers_1.like)({
                someArray: ['one', 'two'],
                someNumber: (0, matchers_1.like)(1),
                someString: "it's a string",
                someObject: (0, matchers_1.like)({
                    foo: (0, matchers_1.like)('some string'),
                    bar: 'some other string',
                }),
            });
        });
    });
    describe('#validateExample', function () {
        describe('when given a valid regex', function () {
            describe('and a matching example', function () {
                it('returns true', function () {
                    (0, chai_1.expect)((0, matchers_1.validateExample)('2010-01-01', matchers_1.ISO8601_DATE_FORMAT)).to.eql(true);
                });
            });
            describe('and a failing example', function () {
                it('returns false', function () {
                    (0, chai_1.expect)((0, matchers_1.validateExample)('not a date', matchers_1.ISO8601_DATE_FORMAT)).to.eql(false);
                });
            });
        });
        describe('when given an invalid regex', function () {
            it('returns an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.validateExample)('', 'abc(');
                }).to.throw(Error);
            });
        });
    });
    describe('#term', function () {
        describe('when given a valid regular expression and example', function () {
            it('returns a serialized Ruby object', function () {
                var expected = {
                    value: 'myawesomeword',
                    regex: '\\w+',
                    'pact:matcher:type': 'regex',
                };
                var match = (0, matchers_1.term)({
                    generate: 'myawesomeword',
                    matcher: '\\w+',
                });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('when not provided with a valid expression', function () {
            var createTheTerm = function (badArg) { return function () {
                (0, matchers_1.term)(badArg);
            }; };
            describe('when no term is provided', function () {
                it('throws an Error', function () {
                    (0, chai_1.expect)(createTheTerm.call({})).to.throw(Error);
                });
            });
            describe('when an invalid term is provided', function () {
                it('throws an Error', function () {
                    (0, chai_1.expect)(createTheTerm({})).to.throw(Error);
                    (0, chai_1.expect)(createTheTerm('')).to.throw(Error);
                    (0, chai_1.expect)(createTheTerm({ value: 'foo' })).to.throw(Error);
                    (0, chai_1.expect)(createTheTerm({ matcher: '\\w+' })).to.throw(Error);
                });
            });
        });
        describe("when given an example that doesn't match the regular expression", function () {
            it('fails with an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.term)({
                        generate: 'abc',
                        matcher: matchers_1.ISO8601_DATE_FORMAT,
                    });
                }).to.throw(Error);
            });
        });
    });
    describe('#somethingLike', function () {
        describe('when provided a value', function () {
            it('returns a serialized Ruby object', function () {
                var expected = {
                    value: 'myspecialvalue',
                    'pact:matcher:type': 'type',
                };
                var match = (0, matchers_1.somethingLike)('myspecialvalue');
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('when not provided with a valid value', function () {
            var createTheValue = function (badArg) { return function () {
                (0, matchers_1.somethingLike)(badArg);
            }; };
            describe('when no value is provided', function () {
                it('`throws an Error', function () {
                    (0, chai_1.expect)(createTheValue.call({})).to.throw(Error);
                });
            });
            describe('when an invalid value is provided', function () {
                it('throws an Error', function () {
                    (0, chai_1.expect)(createTheValue(undefined)).to.throw(Error);
                    (0, chai_1.expect)(createTheValue(function () { })).to.throw(Error);
                });
            });
        });
    });
    describe('#eachLike', function () {
        describe('when content is null', function () {
            it('provides null as contents', function () {
                var expected = {
                    value: [null],
                    'pact:matcher:type': 'type',
                    min: 1,
                };
                var match = (0, matchers_1.eachLike)(null, { min: 1 });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('when an object is provided', function () {
            it('provides the object as contents', function () {
                var expected = {
                    value: [{ a: 1 }],
                    'pact:matcher:type': 'type',
                    min: 1,
                };
                var match = (0, matchers_1.eachLike)({ a: 1 }, { min: 1 });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('when object.min is invalid', function () {
            it('throws an Error message', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.eachLike)({ a: 1 }, { min: 0 });
                }).to.throw(Error);
            });
        });
        describe('when an array is provided', function () {
            it('provides the array as contents', function () {
                var expected = {
                    value: [[1, 2, 3]],
                    'pact:matcher:type': 'type',
                    min: 1,
                };
                var match = (0, matchers_1.eachLike)([1, 2, 3], { min: 1 });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('when a value is provided', function () {
            it('adds the value in contents', function () {
                var expected = {
                    value: ['test'],
                    'pact:matcher:type': 'type',
                    min: 1,
                };
                var match = (0, matchers_1.eachLike)('test', { min: 1 });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('when the content has Pact.Macters', function () {
            describe('of type somethingLike', function () {
                it('nests somethingLike correctly', function () {
                    var expected = {
                        value: [
                            {
                                id: {
                                    value: 10,
                                    'pact:matcher:type': 'type',
                                },
                            },
                        ],
                        'pact:matcher:type': 'type',
                        min: 1,
                    };
                    var match = (0, matchers_1.eachLike)({ id: (0, matchers_1.somethingLike)(10) }, { min: 1 });
                    (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
                });
            });
            describe('of type term', function () {
                it('nests term correctly', function () {
                    var expected = {
                        value: [
                            {
                                colour: {
                                    value: 'red',
                                    regex: 'red|green',
                                    'pact:matcher:type': 'regex',
                                },
                            },
                        ],
                        'pact:matcher:type': 'type',
                        min: 1,
                    };
                    var match = (0, matchers_1.eachLike)({
                        colour: (0, matchers_1.term)({
                            generate: 'red',
                            matcher: 'red|green',
                        }),
                    }, { min: 1 });
                    //
                    (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
                });
            });
            describe('of type eachLike', function () {
                it('nests eachlike in contents', function () {
                    var expected = {
                        value: [
                            {
                                value: ['blue'],
                                'pact:matcher:type': 'type',
                                min: 1,
                            },
                        ],
                        'pact:matcher:type': 'type',
                        min: 1,
                    };
                    var match = (0, matchers_1.eachLike)((0, matchers_1.eachLike)('blue', { min: 1 }), { min: 1 });
                    (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
                });
            });
            describe('complex object with multiple Pact.Matchers', function () {
                it('nests objects correctly', function () {
                    var expected = {
                        value: [
                            {
                                value: [
                                    {
                                        colour: {
                                            value: 'red',
                                            'pact:matcher:type': 'regex',
                                            regex: 'red|green|blue',
                                        },
                                        size: {
                                            value: 10,
                                            'pact:matcher:type': 'type',
                                        },
                                        tag: {
                                            value: [
                                                [
                                                    {
                                                        value: 'jumper',
                                                        'pact:matcher:type': 'type',
                                                    },
                                                    {
                                                        value: 'shirt',
                                                        'pact:matcher:type': 'type',
                                                    },
                                                ],
                                                [
                                                    {
                                                        value: 'jumper',
                                                        'pact:matcher:type': 'type',
                                                    },
                                                    {
                                                        value: 'shirt',
                                                        'pact:matcher:type': 'type',
                                                    },
                                                ],
                                            ],
                                            'pact:matcher:type': 'type',
                                            min: 2,
                                        },
                                    },
                                ],
                                'pact:matcher:type': 'type',
                                min: 1,
                            },
                        ],
                        'pact:matcher:type': 'type',
                        min: 1,
                    };
                    var match = (0, matchers_1.eachLike)((0, matchers_1.eachLike)({
                        colour: (0, matchers_1.term)({ generate: 'red', matcher: 'red|green|blue' }),
                        size: (0, matchers_1.somethingLike)(10),
                        tag: (0, matchers_1.eachLike)([(0, matchers_1.somethingLike)('jumper'), (0, matchers_1.somethingLike)('shirt')], { min: 2 }),
                    }, { min: 1 }), { min: 1 });
                    (0, chai_1.expect)(JSON.parse(JSON.stringify(match))).to.deep.include(JSON.parse(JSON.stringify(expected)));
                });
            });
        });
        describe('When no options.min is not provided', function () {
            it('defaults to a min of 1', function () {
                var expected = {
                    value: [{ a: 1 }],
                    'pact:matcher:type': 'type',
                    min: 1,
                };
                var match = (0, matchers_1.eachLike)({ a: 1 });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
        describe('When a options.min is provided', function () {
            it('provides the object as contents', function () {
                var expected = {
                    value: [{ a: 1 }, { a: 1 }, { a: 1 }],
                    'pact:matcher:type': 'type',
                    min: 3,
                };
                var match = (0, matchers_1.eachLike)({ a: 1 }, { min: 3 });
                (0, chai_1.expect)(JSON.stringify(match)).to.deep.include(JSON.stringify(expected));
            });
        });
    });
    describe('#email', function () {
        describe('when given a valid Email address', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.email)('hello@world.com')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.email)('hello@world.com.au')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.email)('hello@a.co')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.email)()).to.be.an('object');
            });
        });
        describe('when given an invalid Email address', function () {
            it('returns an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.email)('hello.world.c');
                }).to.throw(Error);
            });
        });
    });
    describe('#uuid', function () {
        describe('when given a valid UUID', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.uuid)('ce118b6e-d8e1-11e7-9296-cec278b6b50a')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.uuid)()).to.be.an('object');
            });
        });
        describe('when given an invalid UUID', function () {
            it('returns an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.uuid)('abc');
                }).to.throw(Error);
            });
        });
    });
    describe('#ipv4Address', function () {
        describe('when given a valid ipv4Address', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.ipv4Address)('127.0.0.1')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.ipv4Address)()).to.be.an('object');
            });
        });
        describe('when given an invalid ipv4Address', function () {
            it('returns an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.ipv4Address)('abc');
                }).to.throw(Error);
            });
        });
    });
    describe('#ipv6Address', function () {
        describe('when given a valid ipv6Address', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.ipv6Address)('::1')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.ipv6Address)('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.ipv6Address)()).to.be.an('object');
            });
        });
        describe('when given an invalid ipv6Address', function () {
            it('returns an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.ipv6Address)('abc');
                }).to.throw(Error);
            });
        });
    });
    describe('#hexadecimal', function () {
        describe('when given a valid hexadecimal', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.hexadecimal)('6F')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.hexadecimal)()).to.be.an('object');
            });
        });
        describe('when given an invalid hexadecimal', function () {
            it('returns an error', function () {
                (0, chai_1.expect)(function () {
                    (0, matchers_1.hexadecimal)('x1');
                }).to.throw(Error);
            });
        });
    });
    describe('#boolean', function () {
        describe('when used it should create a JSON object', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.boolean)()).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.boolean)().value).to.equal(true);
            });
            it('sets value=false', function () {
                (0, chai_1.expect)((0, matchers_1.boolean)(false)).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.boolean)(false).value).to.equal(false);
            });
            it('sets value=true', function () {
                (0, chai_1.expect)((0, matchers_1.boolean)(true)).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.boolean)(true).value).to.equal(true);
            });
        });
    });
    describe('#string', function () {
        describe('when given a valid string', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.string)('test')).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.string)()).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.string)('test').value).to.equal('test');
            });
        });
    });
    describe('#decimal', function () {
        describe('when given a valid decimal', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.decimal)(10.1)).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.decimal)()).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.decimal)(0.0).value).to.equal(0.0);
            });
        });
    });
    describe('#integer', function () {
        describe('when given a valid integer', function () {
            it('creates a valid matcher', function () {
                (0, chai_1.expect)((0, matchers_1.integer)(10)).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.integer)()).to.be.an('object');
                (0, chai_1.expect)((0, matchers_1.integer)(0).value).to.equal(0);
            });
        });
    });
    describe('Date Matchers', function () {
        describe('#rfc1123Timestamp', function () {
            describe('when given a valid rfc1123Timestamp', function () {
                it('creates a valid matcher', function () {
                    (0, chai_1.expect)((0, matchers_1.rfc1123Timestamp)('Mon, 31 Oct 2016 15:21:41 -0400')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.rfc1123Timestamp)()).to.be.an('object');
                });
            });
            describe('when given an invalid rfc1123Timestamp', function () {
                it('returns an error', function () {
                    (0, chai_1.expect)(function () {
                        (0, matchers_1.rfc1123Timestamp)('abc');
                    }).to.throw(Error);
                });
            });
        });
        describe('#iso8601Time', function () {
            describe('when given a valid iso8601Time', function () {
                it('creates a valid matcher', function () {
                    (0, chai_1.expect)((0, matchers_1.iso8601Time)('T22:44:30.652Z')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601Time)()).to.be.an('object');
                });
            });
            describe('when given an invalid iso8601Time', function () {
                it('returns an error', function () {
                    (0, chai_1.expect)(function () {
                        (0, matchers_1.iso8601Time)('abc');
                    }).to.throw(Error);
                });
            });
        });
        describe('#iso8601Date', function () {
            describe('when given a valid iso8601Date', function () {
                it('creates a valid matcher', function () {
                    (0, chai_1.expect)((0, matchers_1.iso8601Date)('2017-12-05')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601Date)()).to.be.an('object');
                });
            });
            describe('when given an invalid iso8601Date', function () {
                it('returns an error', function () {
                    (0, chai_1.expect)(function () {
                        (0, matchers_1.iso8601Date)('abc');
                    }).to.throw(Error);
                });
            });
        });
        describe('#iso8601DateTime', function () {
            describe('when given a valid iso8601DateTime', function () {
                it('creates a valid matcher', function () {
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTime)('2015-08-06T16:53:10+01:00')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTime)()).to.be.an('object');
                });
            });
            describe('when given an invalid iso8601DateTime', function () {
                it('returns an error', function () {
                    (0, chai_1.expect)(function () {
                        (0, matchers_1.iso8601DateTime)('abc');
                    }).to.throw(Error);
                });
            });
        });
        describe('#iso8601DateTimeWithMillis', function () {
            describe('when given a valid iso8601DateTimeWithMillis', function () {
                it('creates a valid matcher', function () {
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTimeWithMillis)('2015-08-06T16:53:10.123+01:00')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTimeWithMillis)('2015-08-06T16:53:10.537357Z')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTimeWithMillis)('2020-12-10T09:01:29.06Z')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTimeWithMillis)('2020-12-10T09:01:29.1Z')).to.be.an('object');
                    (0, chai_1.expect)((0, matchers_1.iso8601DateTimeWithMillis)()).to.be.an('object');
                });
            });
            describe('when given an invalid iso8601DateTimeWithMillis', function () {
                it('returns an error', function () {
                    (0, chai_1.expect)(function () {
                        (0, matchers_1.iso8601DateTimeWithMillis)('abc');
                    }).to.throw(Error);
                });
            });
        });
        describe('#extractPayload', function () {
            describe('when given an object with no matchers', function () {
                var object = {
                    some: 'data',
                    more: 'strings',
                    an: ['array'],
                    someObject: {
                        withData: true,
                        withNumber: 1,
                    },
                };
                it('returns just that object', function () {
                    (0, chai_1.expect)((0, matchers_1.extractPayload)(object)).to.deep.equal(object);
                });
            });
            describe('when given an object with null values', function () {
                var object = {
                    some: 'data',
                    more: null,
                    an: [null],
                    someObject: {
                        withData: true,
                        withNumber: 1,
                        andNull: null,
                    },
                };
                it('returns just that object', function () {
                    (0, chai_1.expect)((0, matchers_1.extractPayload)(object)).to.deep.equal(object);
                });
            });
            describe('when given an object with some matchers', function () {
                var someMatchers = {
                    some: (0, matchers_1.somethingLike)('data'),
                    more: 'strings',
                    an: ['array'],
                    another: (0, matchers_1.eachLike)('this'),
                    someObject: {
                        withData: (0, matchers_1.somethingLike)(true),
                        withTerm: (0, matchers_1.term)({ generate: 'this', matcher: 'this|that' }),
                        withNumber: 1,
                        withAnotherNumber: (0, matchers_1.somethingLike)(2),
                    },
                };
                var expected = {
                    some: 'data',
                    more: 'strings',
                    an: ['array'],
                    another: ['this'],
                    someObject: {
                        withData: true,
                        withTerm: 'this',
                        withNumber: 1,
                        withAnotherNumber: 2,
                    },
                };
                it('returns without matching guff', function () {
                    (0, chai_1.expect)((0, matchers_1.extractPayload)(someMatchers)).to.deep.equal(expected);
                });
            });
            describe('when given a simple matcher', function () {
                it('removes all matching guff', function () {
                    var expected = 'myawesomeword';
                    var matcher = (0, matchers_1.term)({
                        generate: 'myawesomeword',
                        matcher: '\\w+',
                    });
                    (0, chai_1.expect)((0, matchers_1.isMatcher)(matcher)).to.eq(true);
                    (0, chai_1.expect)((0, matchers_1.extractPayload)(matcher)).to.eql(expected);
                });
            });
            describe('when given a complex nested object with matchers', function () {
                it('removes all matching guff', function () {
                    var o = (0, matchers_1.somethingLike)({
                        stringMatcher: {
                            awesomeSetting: (0, matchers_1.somethingLike)('a string'),
                        },
                        anotherStringMatcher: {
                            nestedSetting: {
                                anotherStringMatcherSubSetting: (0, matchers_1.somethingLike)(true),
                            },
                            anotherSetting: (0, matchers_1.term)({ generate: 'this', matcher: 'this|that' }),
                        },
                        arrayMatcher: {
                            lotsOfValueregex: (0, matchers_1.eachLike)('useful', { min: 3 }),
                        },
                        arrayOfMatcherregex: {
                            lotsOfValueregex: (0, matchers_1.eachLike)({
                                foo: 'bar',
                                baz: (0, matchers_1.somethingLike)('bat'),
                            }, { min: 3 }),
                        },
                    });
                    var expected = {
                        stringMatcher: {
                            awesomeSetting: 'a string',
                        },
                        anotherStringMatcher: {
                            nestedSetting: {
                                anotherStringMatcherSubSetting: true,
                            },
                            anotherSetting: 'this',
                        },
                        arrayMatcher: {
                            lotsOfValueregex: ['useful', 'useful', 'useful'],
                        },
                        arrayOfMatcherregex: {
                            lotsOfValueregex: [
                                {
                                    baz: 'bat',
                                    foo: 'bar',
                                },
                                {
                                    baz: 'bat',
                                    foo: 'bar',
                                },
                                {
                                    baz: 'bat',
                                    foo: 'bar',
                                },
                            ],
                        },
                    };
                    (0, chai_1.expect)((0, matchers_1.extractPayload)(o)).to.deep.equal(expected);
                });
            });
        });
    });
});
//# sourceMappingURL=matchers.spec.js.map