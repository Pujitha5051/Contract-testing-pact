"use strict";
/**
 * @module Message
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
exports.MessageProviderPact = exports.providerWithMetadata = exports.setupProxyServer = exports.waitForServerReady = void 0;
var lodash_1 = require("lodash");
var pact_core_1 = __importDefault(require("@pact-foundation/pact-core"));
var express_1 = __importDefault(require("express"));
var http = __importStar(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var js_base64_1 = require("js-base64");
var logger_1 = __importStar(require("./common/logger"));
// Listens for the server start event
// Converts event Emitter to a Promise
var waitForServerReady = function (server) {
    return new Promise(function (resolve, reject) {
        server.on('listening', function () { return resolve(server); });
        server.on('error', function () { return reject(); });
    });
};
exports.waitForServerReady = waitForServerReady;
// Get the Proxy we'll pass to the CLI for verification
var setupProxyServer = function (app) { return http.createServer(app).listen(); };
exports.setupProxyServer = setupProxyServer;
var hasMetadata = function (o) {
    return Boolean(o.__pactMessageMetadata);
};
var providerWithMetadata = function (provider, metadata) {
    return function (descriptor) {
        return Promise.resolve(provider(descriptor)).then(function (message) {
            return hasMetadata(message)
                ? {
                    __pactMessageMetadata: __assign(__assign({}, message.__pactMessageMetadata), metadata),
                    message: message,
                }
                : { __pactMessageMetadata: metadata, message: message };
        });
    };
};
exports.providerWithMetadata = providerWithMetadata;
/**
 * A Message Provider is analagous to Consumer in the HTTP Interaction model.
 *
 * It is the initiator of an interaction, and expects something on the other end
 * of the interaction to respond - just in this case, not immediately.
 */
var MessageProviderPact = /** @class */ (function () {
    function MessageProviderPact(config) {
        this.config = config;
        if (config.logLevel && !(0, lodash_1.isEmpty)(config.logLevel)) {
            pact_core_1.default.logLevel(config.logLevel);
            (0, logger_1.setLogLevel)(config.logLevel);
        }
        else {
            (0, logger_1.setLogLevel)();
        }
    }
    /**
     * Verify a Message Provider.
     */
    MessageProviderPact.prototype.verify = function () {
        logger_1.default.info('Verifying message');
        // Start the verification CLI proxy server
        var app = this.setupProxyApplication();
        var server = (0, exports.setupProxyServer)(app);
        // Run the verification once the proxy server is available
        return (0, exports.waitForServerReady)(server)
            .then(this.runProviderVerification())
            .then(function (result) {
            server.close();
            return result;
        }, function (err) {
            server.close();
            throw err;
        });
    };
    // Run the Verification CLI process
    MessageProviderPact.prototype.runProviderVerification = function () {
        var _this = this;
        return function (server) {
            var opts = __assign(__assign({}, (0, lodash_1.omit)(_this.config, 'handlers')), { providerBaseUrl: "http://localhost:".concat(server.address().port) });
            return pact_core_1.default.verifyPacts(opts);
        };
    };
    // Get the API handler for the verification CLI process to invoke on POST /*
    MessageProviderPact.prototype.setupVerificationHandler = function () {
        var _this = this;
        return function (req, res) {
            var message = req.body;
            // Invoke the handler, and return the JSON response body
            // wrapped in a Message
            _this.setupStates(message)
                .then(function () { return _this.findHandler(message); })
                .then(function (handler) { return handler(message); })
                .then(function (messageFromHandler) {
                if (hasMetadata(messageFromHandler)) {
                    var metadata = (0, js_base64_1.encode)(JSON.stringify(messageFromHandler.__pactMessageMetadata));
                    res.header('Pact-Message-Metadata', metadata);
                    res.header('PACT_MESSAGE_METADATA', metadata);
                    return res.json(messageFromHandler.message);
                }
                return res.json(messageFromHandler);
            })
                .catch(function (e) { return res.status(500).send(e); });
        };
    };
    // Get the Express app that will run on the HTTP Proxy
    MessageProviderPact.prototype.setupProxyApplication = function () {
        var app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(function (req, res, next) {
            // TODO: this seems to override the metadata for content-type
            res.header('Content-Type', 'application/json; charset=utf-8');
            next();
        });
        // Proxy server will respond to Verifier process
        app.all('/*', this.setupVerificationHandler());
        return app;
    };
    // Lookup the handler based on the description, or get the default handler
    MessageProviderPact.prototype.setupStates = function (message) {
        var _this = this;
        var promises = [];
        if (message.providerStates) {
            message.providerStates.forEach(function (state) {
                var handler = _this.config.stateHandlers
                    ? _this.config.stateHandlers[state.name]
                    : null;
                if (handler) {
                    promises.push(handler(state.name, state.params));
                }
                else {
                    logger_1.default.warn("no state handler found for \"".concat(state.name, "\", ignoring"));
                }
            });
        }
        return Promise.all(promises);
    };
    // Lookup the handler based on the description, or get the default handler
    MessageProviderPact.prototype.findHandler = function (message) {
        var handler = this.config.messageProviders[message.description || ''];
        if (!handler) {
            logger_1.default.error("no handler found for message ".concat(message.description));
            return Promise.reject(new Error("No handler found for message \"".concat(message.description, "\".\n             Check your \"handlers\" configuration")));
        }
        return Promise.resolve(handler);
    };
    return MessageProviderPact;
}());
exports.MessageProviderPact = MessageProviderPact;
//# sourceMappingURL=messageProviderPact.js.map