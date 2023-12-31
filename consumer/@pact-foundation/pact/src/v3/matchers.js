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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPayload = exports.reify = exports.matcherValueOrString = exports.uuid = exports.fromProviderState = exports.arrayContaining = exports.url = exports.url2 = exports.nullValue = exports.includes = exports.date = exports.time = exports.timestamp = exports.datetime = exports.equal = exports.regex = exports.string = exports.number = exports.decimal = exports.integer = exports.boolean = exports.constrainedArrayLike = exports.atMostLike = exports.atLeastLike = exports.atLeastOneLike = exports.eachLike = exports.eachKeyLike = exports.like = exports.isMatcher = void 0;
var ramda_1 = require("ramda");
var randexp_1 = __importDefault(require("randexp"));
function isMatcher(x) {
    return x != null && x.value !== undefined;
}
exports.isMatcher = isMatcher;
/**
 * Value must match the given template
 * @param template Template to base the comparison on
 */
var like = function (template) { return ({
    'pact:matcher:type': 'type',
    value: template,
}); };
exports.like = like;
/**
 * Object where the key itself is ignored, but the value template must match.
 *
 * @param keyTemplate Example key to use
 * @param template Example value template to base the comparison on
 */
var eachKeyLike = function (keyTemplate, template) {
    var _a;
    return ({
        'pact:matcher:type': 'values',
        value: (_a = {},
            _a[keyTemplate] = template,
            _a),
    });
};
exports.eachKeyLike = eachKeyLike;
/**
 * Array where each element must match the given template
 * @param template Template to base the comparison on
 */
var eachLike = function (template) { return ({
    'pact:matcher:type': 'type',
    value: [template],
}); };
exports.eachLike = eachLike;
/**
 * An array that has to have at least one element and each element must match the given template
 * @param template Template to base the comparison on
 * @param count Number of examples to generate, defaults to one
 */
var atLeastOneLike = function (template, count) {
    if (count === void 0) { count = 1; }
    return ({
        min: 1,
        'pact:matcher:type': 'type',
        value: (0, ramda_1.times)(function () { return template; }, count),
    });
};
exports.atLeastOneLike = atLeastOneLike;
/**
 * An array that has to have at least the required number of elements and each element must match the given template
 * @param template Template to base the comparison on
 * @param min Minimum number of elements required in the array
 * @param count Number of examples to generate, defaults to min
 */
var atLeastLike = function (template, min, count) {
    var elements = count || min;
    if (count && count < min) {
        throw new Error("atLeastLike has a minimum of ".concat(min, " but ").concat(count, " elements were requested.") +
            " Make sure the count is greater than or equal to the min.");
    }
    return {
        min: min,
        'pact:matcher:type': 'type',
        value: (0, ramda_1.times)(function () { return template; }, elements),
    };
};
exports.atLeastLike = atLeastLike;
/**
 * An array that has to have at most the required number of elements and each element must match the given template
 * @param template Template to base the comparison on
 * @param max Maximum number of elements required in the array
 * @param count Number of examples to generate, defaults to one
 */
var atMostLike = function (template, max, count) {
    var elements = count || 1;
    if (count && count > max) {
        throw new Error("atMostLike has a maximum of ".concat(max, " but ").concat(count, " elements where requested.") +
            " Make sure the count is less than or equal to the max.");
    }
    return {
        max: max,
        'pact:matcher:type': 'type',
        value: (0, ramda_1.times)(function () { return template; }, elements),
    };
};
exports.atMostLike = atMostLike;
/**
 * An array whose size is constrained to the minimum and maximum number of elements and each element must match the given template
 * @param template Template to base the comparison on
 * @param min Minimum number of elements required in the array
 * @param max Maximum number of elements required in the array
 * @param count Number of examples to generate, defaults to one
 */
var constrainedArrayLike = function (template, min, max, count) {
    var elements = count || min;
    if (count) {
        if (count < min) {
            throw new Error("constrainedArrayLike has a minimum of ".concat(min, " but ").concat(count, " elements where requested.") +
                " Make sure the count is greater than or equal to the min.");
        }
        else if (count > max) {
            throw new Error("constrainedArrayLike has a maximum of ".concat(max, " but ").concat(count, " elements where requested.") +
                " Make sure the count is less than or equal to the max.");
        }
    }
    return {
        min: min,
        max: max,
        'pact:matcher:type': 'type',
        value: (0, ramda_1.times)(function () { return template; }, elements),
    };
};
exports.constrainedArrayLike = constrainedArrayLike;
/**
 * Value must be a boolean
 * @param b Boolean example value. Defaults to true if unsupplied
 */
var boolean = function (b) {
    if (b === void 0) { b = true; }
    return ({
        'pact:matcher:type': 'type',
        value: b,
    });
};
exports.boolean = boolean;
/**
 * Value must be an integer (must be a number and have no decimal places)
 * @param int Example value. If omitted a random value will be generated.
 */
var integer = function (int) {
    if (Number.isInteger(int)) {
        return {
            'pact:matcher:type': 'integer',
            value: int,
        };
    }
    if (int) {
        throw new Error("The integer matcher was passed '".concat(int, "' which is not an integer."));
    }
    return {
        'pact:generator:type': 'RandomInt',
        'pact:matcher:type': 'integer',
        value: 101,
    };
};
exports.integer = integer;
/**
 * Value must be a decimal number (must be a number and have decimal places)
 * @param num Example value. If omitted a random value will be generated.
 */
var decimal = function (num) {
    if (Number.isFinite(num)) {
        return {
            'pact:matcher:type': 'decimal',
            value: num,
        };
    }
    if (num) {
        throw new Error("The decimal matcher was passed '".concat(num, "' which is not a number."));
    }
    return {
        'pact:generator:type': 'RandomDecimal',
        'pact:matcher:type': 'decimal',
        value: 12.34,
    };
};
exports.decimal = decimal;
/**
 * Value must be a number
 * @param num Example value. If omitted a random integer value will be generated.
 */
function number(num) {
    if (num) {
        return {
            'pact:matcher:type': 'number',
            value: num,
        };
    }
    return {
        'pact:generator:type': 'RandomInt',
        'pact:matcher:type': 'number',
        value: 1234,
    };
}
exports.number = number;
/**
 * Value must be a string
 * @param str Example value
 */
function string(str) {
    return {
        'pact:matcher:type': 'type',
        value: str,
    };
}
exports.string = string;
/**
 * Value that must match the given regular expression
 * @param pattern Regular Expression to match
 * @param str Example value
 */
function regex(pattern, str) {
    if (pattern instanceof RegExp) {
        return {
            'pact:matcher:type': 'regex',
            regex: pattern.source,
            value: str,
        };
    }
    return {
        'pact:matcher:type': 'regex',
        regex: pattern,
        value: str,
    };
}
exports.regex = regex;
/**
 * Value that must be equal to the example. This is mainly used to reset the matching rules which cascade.
 * @param value Example value
 */
var equal = function (value) { return ({
    'pact:matcher:type': 'equality',
    value: value,
}); };
exports.equal = equal;
/**
 * String value that must match the provided datetime format string.
 * @param format Datetime format string. See [Java SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html)
 * @param example Example value to use. If omitted a value using the current system date and time will be generated.
 */
function datetime(format, example) {
    if (!example) {
        throw new Error("you must provide an example datetime");
    }
    return (0, ramda_1.pickBy)(function (v) { return !(0, ramda_1.isNil)(v); }, {
        'pact:generator:type': example ? undefined : 'DateTime',
        'pact:matcher:type': 'timestamp',
        format: format,
        value: example,
    });
}
exports.datetime = datetime;
/**
 * String value that must match the provided datetime format string.
 * @param format Datetime format string. See [Java SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html)
 * @param example Example value to use. If omitted a value using the current system date and time will be generated.
 */
function timestamp(format, example) {
    if (!example) {
        throw new Error("you must provide an example timestamp");
    }
    return datetime(format, example);
}
exports.timestamp = timestamp;
/**
 * String value that must match the provided time format string.
 * @param format Time format string. See [Java SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html)
 * @param example Example value to use. If omitted a value using the current system time will be generated.
 */
function time(format, example) {
    if (!example) {
        throw new Error("you must provide an example time");
    }
    return {
        'pact:generator:type': 'Time',
        'pact:matcher:type': 'time',
        format: format,
        value: example,
    };
}
exports.time = time;
/**
 * String value that must match the provided date format string.
 * @param format Date format string. See [Java SimpleDateFormat](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html)
 * @param example Example value to use. If omitted a value using the current system date will be generated.
 */
function date(format, example) {
    if (!example) {
        throw new Error("you must provide an example date");
    }
    return {
        format: format,
        'pact:generator:type': 'Date',
        'pact:matcher:type': 'date',
        value: example,
    };
}
exports.date = date;
/**
 * Value that must include the example value as a substring.
 * @param value String value to include
 */
function includes(value) {
    return {
        'pact:matcher:type': 'include',
        value: value,
    };
}
exports.includes = includes;
/**
 * Value that must be null. This will only match the JSON Null value. For other content types, it will
 * match if the attribute is missing.
 */
function nullValue() {
    return {
        'pact:matcher:type': 'null',
    };
}
exports.nullValue = nullValue;
function stringFromRegex(r) {
    return new randexp_1.default(r).gen();
}
/**
 * Matches a URL composed of a base path and a list of path fragments
 * @param basePath Base path of the URL. If null, will use the base URL from the mock server.
 * @param pathFragments list of path fragments, can be regular expressions
 */
function url2(basePath, pathFragments) {
    var regexpr = __spreadArray([
        '.*('
    ], pathFragments.map(function (p) {
        if (p instanceof RegExp) {
            return "\\/".concat(p.source);
        }
        if (p instanceof Object && p['pact:matcher:type'] === 'regex') {
            return "\\/".concat(p.regex);
        }
        return "\\/".concat(p.toString());
    }), true).join('');
    var example = __spreadArray([
        basePath || 'http://localhost:8080'
    ], pathFragments.map(function (p) {
        if (p instanceof RegExp) {
            return "/".concat(stringFromRegex(p));
        }
        if (p instanceof Object && p['pact:matcher:type'] === 'regex') {
            return "/".concat(p.value);
        }
        return "/".concat(p.toString());
    }), true).join('');
    // Temporary fix for inconsistancies between matchers and generators. Matchers use "value" attribute for
    // example values, while generators use "example"
    if (basePath == null) {
        return {
            'pact:matcher:type': 'regex',
            'pact:generator:type': 'MockServerURL',
            regex: "".concat(regexpr, ")$"),
            value: example,
            example: example,
        };
    }
    return {
        'pact:matcher:type': 'regex',
        regex: "".concat(regexpr, ")$"),
        value: example,
    };
}
exports.url2 = url2;
/**
 * Matches a URL composed of a list of path fragments. The base URL from the mock server will be used.
 * @param pathFragments list of path fragments, can be regular expressions
 */
function url(pathFragments) {
    return url2(null, pathFragments);
}
exports.url = url;
/**
 * Matches the items in an array against a number of variants. Matching is successful if each variant
 * occurs once in the array. Variants may be objects containing matching rules.
 */
function arrayContaining() {
    var variants = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        variants[_i] = arguments[_i];
    }
    return {
        'pact:matcher:type': 'arrayContains',
        variants: variants,
    };
}
exports.arrayContaining = arrayContaining;
/**
 * Marks an item to be injected from the provider state
 * @param expression Expression to lookup in the provider state context
 * @param exampleValue Example value to use in the consumer test
 */
function fromProviderState(expression, exampleValue) {
    return {
        'pact:matcher:type': 'type',
        'pact:generator:type': 'ProviderState',
        expression: expression,
        value: exampleValue,
    };
}
exports.fromProviderState = fromProviderState;
/**
 * Match a universally unique identifier (UUID). Random values will be used for examples if no example is given.
 */
function uuid(example) {
    var regexStr = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    if (example) {
        var regexpr = new RegExp("^".concat(regexStr, "$"));
        if (!example.match(regexpr)) {
            throw new Error("regex: Example value '".concat(example, "' does not match the UUID regular expression '").concat(regexStr, "'"));
        }
        return {
            'pact:matcher:type': 'regex',
            regex: regexStr,
            value: example,
        };
    }
    return {
        'pact:matcher:type': 'regex',
        regex: regexStr,
        'pact:generator:type': 'Uuid',
        value: 'e2490de5-5bd3-43d5-b7c4-526e33f71304',
    };
}
exports.uuid = uuid;
var matcherValueOrString = function (obj) {
    if (typeof obj === 'string')
        return obj;
    return JSON.stringify(obj);
};
exports.matcherValueOrString = matcherValueOrString;
/**
 * Recurse the object removing any underlying matching guff, returning the raw
 * example content.
 */
function reify(input) {
    if (isMatcher(input)) {
        return reify(input.value);
    }
    if (Object.prototype.toString.call(input) === '[object Array]') {
        return input.map(reify);
    }
    if (input !== null && typeof input === 'object') {
        return Object.keys(input).reduce(function (acc, propName) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[propName] = reify(input[propName]), _a)));
        }, {});
    }
    return input;
}
exports.reify = reify;
exports.extractPayload = reify;
//# sourceMappingURL=matchers.js.map