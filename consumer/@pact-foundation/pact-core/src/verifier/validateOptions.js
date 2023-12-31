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
exports.validateOptions = exports.validationRules = exports.requiresOneOf = exports.requires = exports.incompatibleWith = exports.deprecatedBy = exports.deprecatedFunction = void 0;
const checkTypes = require("check-types");
const underscore_1 = require("underscore");
const logger_1 = __importStar(require("../logger"));
const deprecatedFunction = () => (_, property) => {
    logger_1.default.warn(`${property} is deprecated and no longer has any effect`);
    return true;
};
exports.deprecatedFunction = deprecatedFunction;
const deprecatedBy = (preferredOption) => () => (_, property) => {
    logger_1.default.warn(`${property} is deprecated, use ${preferredOption} instead`);
    return true;
};
exports.deprecatedBy = deprecatedBy;
const incompatibleWith = (keys) => (options) => (_, property) => {
    const incompatibilities = (0, underscore_1.pick)(options, keys);
    if (Object.keys(incompatibilities).length > 0) {
        (0, logger_1.logErrorAndThrow)(`${property} is incompatible with the following properties: ${keys.join(',')}`);
        return false;
    }
    return true;
};
exports.incompatibleWith = incompatibleWith;
const requires = (keys) => (options) => (_, property) => {
    const required = (0, underscore_1.pick)(options, keys);
    if (keys.length !== Object.keys(required).length) {
        (0, logger_1.logErrorAndThrow)(`${property} requires the following properties: ${keys.join(',')}`);
        return false;
    }
    return true;
};
exports.requires = requires;
const requiresOneOf = (keys) => (options) => (_, property) => {
    const required = (0, underscore_1.pick)(options, keys);
    if (Object.keys(required).length === 0) {
        (0, logger_1.logErrorAndThrow)(`${property} requires one of the following properties: ${keys.join(',')}`);
        return false;
    }
    return true;
};
exports.requiresOneOf = requiresOneOf;
const assertNonEmptyString = () => (a, property) => checkTypes.assert.nonEmptyString(a, property);
const assertBoolean = () => (a, property) => checkTypes.assert.boolean(a, property);
const assertPositive = () => (a, property) => checkTypes.assert.positive(a, property);
const LogLevels = ['debug', 'error', 'info', 'trace', 'warn'];
const logLevelValidator = () => (l) => {
    if (typeof l === 'string') {
        if (LogLevels.includes(l.toLowerCase())) {
            return true;
        }
    }
    throw new Error(`The logLevel '${l}' is not a valid logLevel. The valid options are: ${LogLevels.join(', ')}`);
};
const consumerVersionSelectorValidator = (options) => () => {
    if (options.consumerVersionSelectors &&
        Array.isArray(options.consumerVersionSelectors)) {
        const PROPS = [
            'tag',
            'latest',
            'consumer',
            'deployedOrReleased',
            'deployed',
            'released',
            'environment',
            'fallbackTag',
            'branch',
            'mainBranch',
            'matchingBranch',
        ];
        options.consumerVersionSelectors.forEach((selector) => {
            if (selector.tag === 'latest') {
                logger_1.default.warn("Using the tag 'latest' is not recommended and probably does not do what you intended.");
                logger_1.default.warn('    See https://docs.pact.io/pact_broker/tags/#latest-pacts');
                logger_1.default.warn('    If you need to specify latest, try:');
                logger_1.default.warn('       consumerVersionSelectors: [{ lastest: true }]');
            }
            Object.keys(selector).forEach((key) => {
                if (!PROPS.includes(key)) {
                    logger_1.default.warn(`The consumer version selector '${key}' is unknown but will be sent through to the validation. Allowed properties are ${PROPS.join(', ')})`);
                }
            });
        });
    }
    return true;
};
const consumerVersionTagsValidator = (options) => () => {
    if (options.consumerVersionTags) {
        if (!checkTypes.string(options.consumerVersionTags) &&
            !checkTypes.array.of.string(options.consumerVersionTags)) {
            throw new Error('consumerVersionTags should be a string or an array of strings');
        }
        if (options.consumerVersionTags.includes('latest')) {
            logger_1.default.warn("Using the tag 'latest' is not recommended and probably does not do what you intended.");
            logger_1.default.warn('    See https://docs.pact.io/pact_broker/tags/#latest-pacts');
            logger_1.default.warn('    If you need to specify latest, try:');
            logger_1.default.warn('       consumerVersionSelectors: [{ lastest: true }]');
        }
    }
    return true;
};
const customProviderHeadersValidator = (options) => () => {
    if (options.customProviderHeaders) {
        if (Array.isArray(options.customProviderHeaders)) {
            checkTypes.assert.array.of.string(options.customProviderHeaders);
        }
        else {
            checkTypes.assert.nonEmptyObject(options.customProviderHeaders);
        }
    }
    return true;
};
exports.validationRules = {
    providerBaseUrl: [assertNonEmptyString],
    buildUrl: [assertNonEmptyString],
    consumerVersionSelectors: [consumerVersionSelectorValidator],
    consumerVersionTags: [consumerVersionTagsValidator],
    customProviderHeaders: [customProviderHeadersValidator],
    disableSslVerification: [assertBoolean],
    enablePending: [assertBoolean],
    format: [exports.deprecatedFunction],
    includeWipPactsSince: [assertNonEmptyString],
    provider: [assertNonEmptyString],
    pactUrls: [assertNonEmptyString],
    pactBrokerUrl: [
        assertNonEmptyString,
        (0, exports.requires)(['provider']),
        (0, exports.requiresOneOf)([
            'pactUrls',
            'consumerVersionSelectors',
            'consumerVersionTags',
        ]),
    ],
    pactBrokerUsername: [
        assertNonEmptyString,
        (0, exports.incompatibleWith)(['pactBrokerToken']),
        (0, exports.requires)(['pactBrokerPassword']),
    ],
    pactBrokerPassword: [
        assertNonEmptyString,
        (0, exports.incompatibleWith)(['pactBrokerToken']),
        (0, exports.requires)(['pactBrokerUsername']),
    ],
    pactBrokerToken: [
        assertNonEmptyString,
        (0, exports.incompatibleWith)(['pactBrokerUsername', 'pactBrokerPassword']),
    ],
    providerVersionTags: [assertNonEmptyString],
    providerBranch: [
        assertNonEmptyString,
        (0, exports.deprecatedBy)('providerVersionBranch'),
    ],
    providerVersionBranch: [assertNonEmptyString],
    providerStatesSetupUrl: [assertNonEmptyString],
    providerStatesSetupTeardown: [assertBoolean],
    providerStatesSetupBody: [assertBoolean],
    publishVerificationResult: [assertBoolean, (0, exports.requires)(['providerVersion'])],
    providerVersion: [assertNonEmptyString],
    timeout: [assertPositive],
    logLevel: [logLevelValidator],
    out: [exports.deprecatedFunction],
    verbose: [exports.deprecatedFunction],
    monkeypatch: [exports.deprecatedFunction],
    logDir: [exports.deprecatedFunction],
    consumerFilters: [assertNonEmptyString],
    failIfNoPactsFound: [assertBoolean],
    transports: [],
};
const validateOptions = (options) => {
    Object.keys(options).concat('providerBaseUrl').forEach((k) => {
        const rules = exports.validationRules[k];
        if (Array.isArray(options[k])) {
            options[k].forEach((item) => {
                (rules || []).forEach((rule) => {
                    rule(options)(item, k);
                });
            });
        }
        else {
            (rules || []).forEach((rule) => {
                rule(options)(options[k], k);
            });
        }
    });
    return options;
};
exports.validateOptions = validateOptions;
//# sourceMappingURL=validateOptions.js.map