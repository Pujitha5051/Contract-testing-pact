"use strict";
/**
 * @module Message
 */
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
exports.asynchronousBodyHandler = exports.synchronousBodyHandler = exports.MessageConsumerPact = void 0;
var lodash_1 = require("lodash");
var pact_core_1 = __importStar(require("@pact-foundation/pact-core"));
var ramda_1 = require("ramda");
var logger_1 = __importStar(require("./common/logger"));
var configurationError_1 = __importDefault(require("./errors/configurationError"));
var package_json_1 = require("../package.json");
var spec_1 = require("./common/spec");
var v3_1 = require("./v3");
var DEFAULT_PACT_DIR = './pacts';
// eslint-disable-next-line no-shadow
var ContentType;
(function (ContentType) {
    ContentType[ContentType["JSON"] = 0] = "JSON";
    ContentType[ContentType["BINARY"] = 1] = "BINARY";
    ContentType[ContentType["STRING"] = 2] = "STRING";
})(ContentType || (ContentType = {}));
/**
 * A Message Consumer is analagous to a Provider in the HTTP Interaction model.
 * It is the receiver of an interaction, and needs to be able to handle whatever
 * request was provided.
 */
var MessageConsumerPact = /** @class */ (function () {
    function MessageConsumerPact(config) {
        this.config = config;
        this.state = {};
        this.pact = (0, pact_core_1.makeConsumerAsyncMessagePact)(config.consumer, config.provider, (0, spec_1.numberToSpec)(config.spec, v3_1.SpecificationVersion.SPECIFICATION_VERSION_V3), config.logLevel);
        this.pact.addMetadata('pact-js', 'version', package_json_1.version);
        this.message = this.pact.newMessage('');
        if (!(0, lodash_1.isEmpty)(config.logLevel)) {
            (0, logger_1.setLogLevel)(config.logLevel);
            pact_core_1.default.logLevel(config.logLevel);
        }
    }
    /**
     * Gives a state the provider should be in for this Message.
     *
     * @param {string} state - The state of the provider.
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.given = function (state) {
        var _this = this;
        if (typeof state === 'string') {
            this.message.given(state);
        }
        else {
            (0, ramda_1.forEachObjIndexed)(function (v, k) {
                _this.message.givenWithParam(state.name, "".concat(k), JSON.stringify(v));
            }, state.params);
        }
        return this;
    };
    /**
     * A free style description of the Message.
     *
     * @param {string} description - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.expectsToReceive = function (description) {
        if ((0, lodash_1.isEmpty)(description)) {
            throw new configurationError_1.default('You must provide a description for the Message.');
        }
        this.message.expectsToReceive(description);
        return this;
    };
    /**
     * The JSON object to be received by the message consumer.
     *
     * May be a JSON object or JSON primitive. The contents must be able to be properly
     * strigified and parse (i.e. via JSON.stringify and JSON.parse).
     *
     * @param {string} content - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.withContent = function (content) {
        if ((0, lodash_1.isEmpty)(content)) {
            throw new configurationError_1.default('You must provide a valid JSON document or primitive for the Message.');
        }
        this.message.withContents(JSON.stringify(content), 'application/json');
        this.state.contentType = ContentType.JSON;
        return this;
    };
    /**
     * The text content to be received by the message consumer.
     *
     * May be any text
     *
     * @param {string} content - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.withTextContent = function (content, contentType) {
        this.message.withContents(content, contentType);
        this.state.contentType = ContentType.STRING;
        return this;
    };
    /**
     * The binary content to be received by the message consumer.
     *
     * Content will be stored in base64 in the resulting pact file.
     *
     * @param {Buffer} content - A buffer containing the binary content
     * @param {String} contenttype - The mime type of the content to expect
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.withBinaryContent = function (content, contentType) {
        this.message.withBinaryContents(content, contentType);
        this.state.contentType = ContentType.BINARY;
        return this;
    };
    /**
     * Message metadata.
     *
     * @param {string} metadata -
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.withMetadata = function (metadata) {
        var _this = this;
        if ((0, lodash_1.isEmpty)(metadata)) {
            throw new configurationError_1.default('You must provide valid metadata for the Message, or none at all');
        }
        (0, ramda_1.forEachObjIndexed)(function (v, k) {
            _this.message.withMetadata("".concat(k), typeof v === 'string' ? v : v.getValue());
        }, metadata);
        return this;
    };
    /**
     * Creates a new Pact _message_ interaction to build a testable interaction.
     *
     * @param handler A message handler, that must be able to consume the given Message
     * @returns {Promise}
     */
    MessageConsumerPact.prototype.verify = function (handler) {
        var _this = this;
        logger_1.default.info('Verifying message');
        return handler(this.reifiedContent())
            .then(function () {
            var _a;
            _this.pact.writePactFile((_a = _this.config.dir) !== null && _a !== void 0 ? _a : DEFAULT_PACT_DIR, _this.config.pactfileWriteMode === 'overwrite');
        })
            .finally(function () {
            _this.message = _this.pact.newMessage('');
            _this.state = {};
        });
    };
    MessageConsumerPact.prototype.reifiedContent = function () {
        var raw = this.message.reifyMessage();
        logger_1.default.debug("reified message raw: raw");
        var reified = JSON.parse(raw);
        if (this.state.contentType === ContentType.BINARY) {
            reified.contents = Buffer.from(reified.contents, 'base64');
        }
        logger_1.default.debug("rehydrated message body into correct type: ".concat(reified.contents));
        return reified;
    };
    /**
     * Returns the Message object created.
     *
     * @returns {Message}
     */
    MessageConsumerPact.prototype.json = function () {
        return this.state;
    };
    return MessageConsumerPact;
}());
exports.MessageConsumerPact = MessageConsumerPact;
// TODO: create more basic adapters for API handlers
// bodyHandler takes a synchronous function and returns
// a wrapped function that accepts a Message and returns a Promise
function synchronousBodyHandler(handler) {
    return function (m) {
        var body = m.contents;
        return new Promise(function (resolve, reject) {
            try {
                var res = handler(body);
                resolve(res);
            }
            catch (e) {
                reject(e);
            }
        });
    };
}
exports.synchronousBodyHandler = synchronousBodyHandler;
// bodyHandler takes an asynchronous (promisified) function and returns
// a wrapped function that accepts a Message and returns a Promise
// TODO: move this into its own package and re-export?
function asynchronousBodyHandler(handler) {
    return function (m) { return handler(m.contents); };
}
exports.asynchronousBodyHandler = asynchronousBodyHandler;
//# sourceMappingURL=messageConsumerPact.js.map