"use strict";
/** @module Matchers
 *
 * For specific matcher types (e.g. IpV6), the values generated are not random
 * but are fixed, to prevent contract invalidation after each run of the consumer test.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matcherValueOrString = exports.extractPayload = exports.regex = exports.like = exports.string = exports.boolean = exports.integer = exports.decimal = exports.hexadecimal = exports.rfc1123Timestamp = exports.iso8601Time = exports.iso8601Date = exports.iso8601DateTimeWithMillis = exports.iso8601DateTime = exports.ipv6Address = exports.ipv4Address = exports.uuid = exports.email = exports.term = exports.somethingLike = exports.eachLike = exports.validateExample = exports.isMatcher = exports.HEX_FORMAT = exports.IPV6_FORMAT = exports.IPV4_FORMAT = exports.UUID_V4_FORMAT = exports.RFC1123_TIMESTAMP_FORMAT = exports.ISO8601_TIME_FORMAT = exports.ISO8601_DATETIME_WITH_MILLIS_FORMAT = exports.ISO8601_DATETIME_FORMAT = exports.ISO8601_DATE_FORMAT = exports.EMAIL_FORMAT = void 0;
var lodash_1 = require("lodash");
var ramda_1 = require("ramda");
var matcherError_1 = __importDefault(require("../errors/matcherError"));
// Note: The following regexes are Ruby formatted,
// so attempting to parse as JS without modification is probably not going to work as intended!
/* tslint:disable:max-line-length */
exports.EMAIL_FORMAT = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$';
exports.ISO8601_DATE_FORMAT = '^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))?)$';
exports.ISO8601_DATETIME_FORMAT = '^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z)$';
exports.ISO8601_DATETIME_WITH_MILLIS_FORMAT = '^\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d(:?[0-5]\\d)?|Z)$';
exports.ISO8601_TIME_FORMAT = '^(T\\d\\d:\\d\\d(:\\d\\d)?(\\.\\d+)?(([+-]\\d\\d:\\d\\d)|Z)?)?$';
exports.RFC1123_TIMESTAMP_FORMAT = '^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\\s\\d{2}\\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s\\d{4}\\s\\d{2}:\\d{2}:\\d{2}\\s(\\+|-)\\d{4}$';
exports.UUID_V4_FORMAT = '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$';
exports.IPV4_FORMAT = '^(\\d{1,3}\\.)+\\d{1,3}$';
exports.IPV6_FORMAT = '^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$';
exports.HEX_FORMAT = '^[0-9a-fA-F]+$';
function isMatcher(x) {
    return x != null && x.getValue !== undefined;
}
exports.isMatcher = isMatcher;
/**
 * Validates the given example against the regex.
 *
 * @param example Example to use in the matcher.
 * @param matcher Regular expression to check.
 */
function validateExample(example, matcher) {
    // Note we escape the double \\ as these get sent over the wire as JSON
    return new RegExp(matcher.replace('\\\\', '\\')).test(example);
}
exports.validateExample = validateExample;
/**
 * The eachLike matcher
 * @param {any} template
 * @param {Object} opts
 * @param {Number} opts.min
 */
function eachLike(template, opts) {
    if ((0, lodash_1.isUndefined)(template)) {
        throw new matcherError_1.default('Error creating a Pact eachLike. Please provide a content argument');
    }
    if (opts && ((0, lodash_1.isNil)(opts.min) || opts.min < 1)) {
        throw new matcherError_1.default('Error creating a Pact eachLike. Please provide opts.min that is > 0');
    }
    var min = !(0, lodash_1.isEmpty)(opts) && opts ? opts.min : 1;
    return {
        value: (0, ramda_1.times)(function () { return template; }, min),
        getValue: function () { return (0, ramda_1.times)(function () { return template; }, min); },
        'pact:matcher:type': 'type',
        min: min,
    };
}
exports.eachLike = eachLike;
/**
 * The somethingLike matcher
 * @param {any} value - the value to be somethingLike
 */
function somethingLike(value) {
    if ((0, lodash_1.isNil)(value) || (0, lodash_1.isFunction)(value)) {
        throw new matcherError_1.default('Error creating a Pact somethingLike Match. Value cannot be a function or undefined');
    }
    return {
        value: value,
        getValue: function () { return value; },
        'pact:matcher:type': 'type',
    };
}
exports.somethingLike = somethingLike;
exports.like = somethingLike;
/**
 * The term matcher. Also aliased to 'regex' for discoverability.
 * @param {Object} opts
 * @param {string} opts.generate - a value to represent the matched String
 * @param {string} opts.matcher - a Regex representing the value
 */
function term(opts) {
    var generate = opts.generate, matcher = opts.matcher;
    if ((0, lodash_1.isNil)(generate) || (0, lodash_1.isNil)(matcher)) {
        throw new matcherError_1.default("Error creating a Pact Term.\n      Please provide an object containing \"generate\" and \"matcher\" properties");
    }
    if (!validateExample(generate, matcher)) {
        throw new matcherError_1.default("Example '".concat(generate, "' does not match provided regular expression '").concat(matcher, "'"));
    }
    return {
        getValue: function () { return generate; },
        value: generate,
        regex: matcher,
        'pact:matcher:type': 'regex',
    };
}
exports.term = term;
exports.regex = term;
/**
 * Email address matcher.
 * @param {string} address - a email address to use as an example
 */
function email(address) {
    return term({
        generate: address || 'hello@pact.io',
        matcher: exports.EMAIL_FORMAT,
    });
}
exports.email = email;
/**
 * UUID v4 matcher.
 * @param {string} uuuid - a UUID to use as an example.
 */
function uuid(id) {
    return term({
        generate: id || 'ce118b6e-d8e1-11e7-9296-cec278b6b50a',
        matcher: exports.UUID_V4_FORMAT,
    });
}
exports.uuid = uuid;
/**
 * IPv4 matcher.
 * @param {string} ip - an IPv4 address to use as an example. Defaults to `127.0.0.13`
 */
function ipv4Address(ip) {
    return term({
        generate: ip || '127.0.0.13',
        matcher: exports.IPV4_FORMAT,
    });
}
exports.ipv4Address = ipv4Address;
/**
 * IPv6 matcher.
 * @param {string} ip - an IPv6 address to use as an example. Defaults to '::ffff:192.0.2.128'
 */
function ipv6Address(ip) {
    return term({
        generate: ip || '::ffff:192.0.2.128',
        matcher: exports.IPV6_FORMAT,
    });
}
exports.ipv6Address = ipv6Address;
/**
 * ISO8601 DateTime matcher.
 * @param {string} date - an ISO8601 Date and Time string
 *                        e.g. 2015-08-06T16:53:10+01:00 are valid
 */
function iso8601DateTime(date) {
    return term({
        generate: date || '2015-08-06T16:53:10+01:00',
        matcher: exports.ISO8601_DATETIME_FORMAT,
    });
}
exports.iso8601DateTime = iso8601DateTime;
/**
 * ISO8601 DateTime matcher with required millisecond precision
 * @param {string} date - an ISO8601 Date and Time string, e.g. 2015-08-06T16:53:10.123+01:00
 */
function iso8601DateTimeWithMillis(date) {
    return term({
        generate: date || '2015-08-06T16:53:10.123+01:00',
        matcher: exports.ISO8601_DATETIME_WITH_MILLIS_FORMAT,
    });
}
exports.iso8601DateTimeWithMillis = iso8601DateTimeWithMillis;
/**
 * ISO8601 Date matcher.
 * @param {string} date - a basic yyyy-MM-dd date string e.g. 2000-09-31
 */
function iso8601Date(date) {
    return term({
        generate: date || '2013-02-01',
        matcher: exports.ISO8601_DATE_FORMAT,
    });
}
exports.iso8601Date = iso8601Date;
/**
 *  ISO8601 Time Matcher, matches a pattern of the format "'T'HH:mm:ss".
 * @param {string} date - a ISO8601 formatted time string e.g. T22:44:30.652Z
 */
function iso8601Time(time) {
    return term({
        generate: time || 'T22:44:30.652Z',
        matcher: exports.ISO8601_TIME_FORMAT,
    });
}
exports.iso8601Time = iso8601Time;
/**
 * RFC1123 Timestamp matcher "DAY, DD MON YYY hh:mm:ss"
 *
 * @param {string} date - an RFC1123 Date and Time string, e.g. Mon, 31 Oct 2016 15:21:41 -0400
 */
function rfc1123Timestamp(timestamp) {
    return term({
        generate: timestamp || 'Mon, 31 Oct 2016 15:21:41 -0400',
        matcher: exports.RFC1123_TIMESTAMP_FORMAT,
    });
}
exports.rfc1123Timestamp = rfc1123Timestamp;
/**
 * Hexadecimal Matcher.
 * @param {string} hex - a hex value.
 */
function hexadecimal(hex) {
    return term({
        generate: hex || '3F',
        matcher: exports.HEX_FORMAT,
    });
}
exports.hexadecimal = hexadecimal;
/**
 * Decimal Matcher.
 * @param {float} float - a decimal value.
 */
function decimal(float) {
    return somethingLike((0, lodash_1.isNil)(float) ? 13.01 : float);
}
exports.decimal = decimal;
/**
 * Integer Matcher.
 * @param {integer} int - an int value.
 */
function integer(int) {
    return somethingLike((0, lodash_1.isNil)(int) ? 13 : int);
}
exports.integer = integer;
/**
 * Boolean Matcher.
 */
function boolean(value) {
    if (value === void 0) { value = true; }
    return somethingLike(value);
}
exports.boolean = boolean;
/**
 * String Matcher.
 */
function string(value) {
    if (value === void 0) { value = 'iloveorange'; }
    return somethingLike(value);
}
exports.string = string;
// Recurse the object removing any underlying matching guff, returning
// the raw example content
function extractPayload(value) {
    if (isMatcher(value)) {
        return extractPayload(value.getValue());
    }
    if (Object.prototype.toString.call(value) === '[object Array]') {
        return value.map(extractPayload);
    }
    if (value !== null && typeof value === 'object') {
        return Object.keys(value).reduce(function (acc, propName) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[propName] = extractPayload(value[propName]), _a)));
        }, {});
    }
    return value;
}
exports.extractPayload = extractPayload;
// Gets a matcher as JSON or the string value if it's not a matcher
function matcherValueOrString(obj) {
    if (typeof obj === 'string')
        return obj;
    return JSON.stringify(obj);
}
exports.matcherValueOrString = matcherValueOrString;
//# sourceMappingURL=matchers.js.map