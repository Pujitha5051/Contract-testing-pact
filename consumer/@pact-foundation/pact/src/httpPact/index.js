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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pact = void 0;
/* eslint-disable no-promise-executor-return */
var pact_core_1 = __importDefault(require("@pact-foundation/pact-core"));
var index_1 = require("@pact-foundation/pact-core/src/consumer/index");
var cli_color_1 = __importDefault(require("cli-color"));
var path = __importStar(require("path"));
var process_1 = __importDefault(require("process"));
var lodash_1 = require("lodash");
var interaction_1 = require("../dsl/interaction");
var net_1 = require("../common/net");
var logger_1 = __importStar(require("../common/logger"));
var verificationError_1 = __importDefault(require("../errors/verificationError"));
var configurationError_1 = __importDefault(require("../errors/configurationError"));
var tracing_1 = require("./tracing");
var v3_1 = require("../v3");
var package_json_1 = require("../../package.json");
var display_1 = require("../v3/display");
var spec_1 = require("../common/spec");
var ffi_1 = require("./ffi");
var logErrorNoMockServer = function () {
    logger_1.default.error("The pact mock service doesn't appear to be running\n" +
        '  - Please check the logs above to ensure that there are no pact service startup failures\n' +
        '  - Please check that pact lifecycle methods are called in the correct order (setup() needs to be called before this method)\n' +
        '  - Please check that your test code waits for the promises returned from lifecycle methods to complete before calling the next one\n' +
        "  - To learn more about what is happening during your pact run, try setting logLevel: 'DEBUG'");
};
/**
 * Creates a new {@link PactProvider}.
 * @memberof Pact
 * @name create
 * @param {PactOptions} opts
 * @return {@link PactProvider}
 */
var Pact = /** @class */ (function () {
    function Pact(config) {
        this.opts = Pact.createOptionsWithDefaults(config);
        if (this.opts.pactfileWriteMode === 'overwrite') {
            logger_1.default.warn("WARNING: the behaviour of pactfileWriteMode 'overwrite' has changed since version 9.x.x. See the type definition or the MIGRATION.md guide for details.");
        }
        if ((0, lodash_1.isEmpty)(this.opts.consumer)) {
            throw new configurationError_1.default('You must specify a Consumer for this pact.');
        }
        if ((0, lodash_1.isEmpty)(this.opts.provider)) {
            throw new configurationError_1.default('You must specify a Provider for this pact.');
        }
        (0, logger_1.setLogLevel)(this.opts.logLevel);
        pact_core_1.default.logLevel(this.opts.logLevel);
        if (this.opts.logLevel === 'trace') {
            (0, tracing_1.traceHttpInteractions)();
        }
        this.reset();
    }
    Pact.createOptionsWithDefaults = function (opts) {
        return __assign(__assign({}, Pact.defaults), opts);
    };
    /**
     * Setup the pact framework, including allocating a port for the dynamic
     * mock server
     *
     * @returns {Promise}
     */
    Pact.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.opts.port > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, net_1.isPortAvailable)(this.opts.port, this.opts.host)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, net_1.freePort)()];
                    case 3:
                        port = _a.sent();
                        logger_1.default.debug("free port discovered: ".concat(port));
                        this.opts.port = port;
                        _a.label = 4;
                    case 4:
                        // create the mock service
                        this.mockService = {
                            baseUrl: "".concat(this.opts.ssl ? 'https' : 'http', "://").concat(this.opts.host, ":").concat(this.opts.port),
                            pactDetails: {
                                pactfile_write_mode: this.opts.pactfileWriteMode || 'merge',
                                consumer: {
                                    name: this.opts.consumer,
                                },
                                provider: { name: this.opts.provider },
                            },
                        };
                        return [2 /*return*/, this.opts];
                }
            });
        });
    };
    /**
     * Add an interaction to the {@link MockService}.
     * @memberof PactProvider
     * @instance
     * @param {Interaction} interactionObj
     * @returns {Promise}
     */
    Pact.prototype.addInteraction = function (interactionObj) {
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't configured when addInteraction was called"));
        }
        var interaction;
        if (interactionObj instanceof interaction_1.Interaction) {
            // This will throw if not valid
            var interactionState = interactionObj.json();
            // Convert into the same type
            interaction = (0, interaction_1.interactionToInteractionObject)(interactionState);
        }
        else {
            interaction = interactionObj;
        }
        this.interaction.uponReceiving(interaction.uponReceiving);
        if (interaction.state) {
            this.interaction.given(interaction.state);
        }
        (0, ffi_1.setRequestDetails)(this.interaction, interaction.withRequest);
        (0, ffi_1.setResponseDetails)(this.interaction, interaction.willRespondWith);
        this.startMockServer();
        return Promise.resolve('');
    };
    /**
     * Checks with the Mock Service if the expected interactions have been exercised.
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.verify = function () {
        var _this = this;
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when verify was called"));
        }
        var matchingResults = this.pact.mockServerMismatches(this.opts.port);
        var success = this.pact.mockServerMatchedSuccessfully(this.opts.port);
        // Feature flag: allow missing requests on the mock service
        if (!success) {
            var error = 'Test failed for the following reasons:';
            error += "\n\n  ".concat((0, display_1.generateMockServerError)(matchingResults, '\t'));
            /* eslint-disable no-console */
            console.error('');
            console.error(cli_color_1.default.red('Pact verification failed!'));
            console.error(cli_color_1.default.red(error));
            /* eslint-enable */
            this.reset();
            throw new verificationError_1.default('Pact verification failed - expected interactions did not match actual.');
        }
        return this.writePact()
            .then(function () { return _this.reset(); })
            .then(function () { return ''; });
    };
    /**
     * Writes the Pact and clears any interactions left behind and shutdown the
     * mock server
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.finalize = function () {
        if (this.finalized) {
            logger_1.default.warn('finalize() has already been called, this is probably a logic error in your test setup. ' +
                'In the future this will be an error.');
        }
        this.finalized = true;
        return Promise.resolve();
    };
    /**
     * Writes the pact file out to file. Should be called when all tests have been performed for a
     * given Consumer <-> Provider pair. It will write out the Pact to the
     * configured file.
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.writePact = function () {
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when writePact was called"));
        }
        this.pact.writePactFile(this.opts.dir || './pacts', this.opts.pactfileWriteMode !== 'overwrite');
        return Promise.resolve('');
    };
    /**
     * Clear up any interactions in the Provider Mock Server.
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.removeInteractions = function () {
        logger_1.default.info('removeInteractions() is no longer required to be called, but has been kept for compatibility with upgrade from 9.x.x. You should remove any use of this method.');
        return Promise.resolve('');
    };
    Pact.prototype.startMockServer = function () {
        logger_1.default.debug("Setting up Pact mock server with Consumer \"".concat(this.opts.consumer, "\" and Provider \"").concat(this.opts.provider, "\"\n        using mock service on Port: \"").concat(this.opts.port, "\""));
        var port = this.pact.createMockServer(this.opts.host, this.opts.port, this.opts.ssl);
        this.mockServerStartedPort = port;
        logger_1.default.debug("mock service started on port: ".concat(port));
    };
    // reset the internal state
    // (this.pact cannot be re-used between tests)
    Pact.prototype.reset = function () {
        var _a;
        this.pact = (0, index_1.makeConsumerPact)(this.opts.consumer, this.opts.provider, (0, spec_1.numberToSpec)(this.opts.spec, v3_1.SpecificationVersion.SPECIFICATION_VERSION_V2), (_a = this.opts.logLevel) !== null && _a !== void 0 ? _a : 'info');
        this.interaction = this.pact.newInteraction('');
        if (this.mockServerStartedPort) {
            logger_1.default.debug("cleaning up old mock server on port ".concat(this.opts.port));
            var res = this.pact.cleanupMockServer(this.mockServerStartedPort);
            if (!res) {
                logger_1.default.warn('Unable to cleanup the Pact mock server. ');
            }
            this.mockServerStartedPort = undefined;
        }
        this.pact.addMetadata('pact-js', 'version', package_json_1.version);
    };
    Pact.defaults = {
        consumer: '',
        cors: false,
        dir: path.resolve(process_1.default.cwd(), 'pacts'),
        host: '127.0.0.1',
        log: path.resolve(process_1.default.cwd(), 'logs', 'pact.log'),
        logLevel: 'info',
        pactfileWriteMode: 'merge',
        provider: '',
        spec: 2,
        ssl: false,
        port: 0,
    };
    return Pact;
}());
exports.Pact = Pact;
//# sourceMappingURL=index.js.map