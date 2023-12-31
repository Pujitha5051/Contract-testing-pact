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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verifier = void 0;
/**
 * Provider Verifier service
 * @module ProviderVerifier
 */
var pact_core_1 = __importDefault(require("@pact-foundation/pact-core"));
var lodash_1 = require("lodash");
var url = __importStar(require("url"));
var logger_1 = __importStar(require("../../common/logger"));
var configurationError_1 = __importDefault(require("../../errors/configurationError"));
var net_1 = require("../../common/net");
var proxy_1 = require("./proxy");
var Verifier = /** @class */ (function () {
    function Verifier(config) {
        var _this = this;
        this.address = 'http://localhost';
        this.stateSetupPath = '/_pactSetup';
        this.deprecatedFields = ['providerStatesSetupUrl'];
        this.config = config;
        if (this.config.logLevel && !(0, lodash_1.isEmpty)(this.config.logLevel)) {
            pact_core_1.default.logLevel(this.config.logLevel);
            (0, logger_1.setLogLevel)(this.config.logLevel);
        }
        this.deprecatedFields.forEach(function (f) {
            if (_this.config[f]) {
                logger_1.default.warn("".concat(f, " is deprecated, and will be removed in future versions"));
            }
        });
        if (this.config.validateSSL === undefined) {
            this.config.validateSSL = true;
        }
        if (this.config.proxyHost) {
            this.address = "http://".concat(this.config.proxyHost);
        }
        if (this.config.changeOrigin === undefined) {
            this.config.changeOrigin = false;
            if (!this.isLocalVerification()) {
                this.config.changeOrigin = true;
                logger_1.default.debug("non-local provider address ".concat(this.config.providerBaseUrl, " detected, setting 'changeOrigin' to 'true'. This property can be overridden."));
            }
        }
    }
    /**
     * Verify a HTTP Provider
     *
     * @param config
     */
    Verifier.prototype.verifyProvider = function () {
        logger_1.default.info('Verifying provider');
        if ((0, lodash_1.isEmpty)(this.config)) {
            return Promise.reject(new configurationError_1.default('No configuration provided to verifier'));
        }
        // Start the verification CLI proxy server
        var server = (0, proxy_1.createProxy)(this.config, this.stateSetupPath);
        logger_1.default.trace("proxy created, waiting for startup");
        // Run the verification once the proxy server is available
        return (0, proxy_1.waitForServerReady)(server)
            .then(function (passOn) {
            logger_1.default.trace("Proxy is ready at ".concat(server.address().address));
            return passOn;
        })
            .then(this.runProviderVerification())
            .then(function (result) {
            logger_1.default.trace('Verification completed, closing server');
            server.close();
            return result;
        })
            .catch(function (e) {
            logger_1.default.trace("Verification failed(".concat(e.message, "), closing server"));
            server.close();
            throw e;
        });
    };
    // Run the Verification CLI process
    Verifier.prototype.runProviderVerification = function () {
        var _this = this;
        return function (server) {
            var opts = __assign(__assign({ providerStatesSetupUrl: "".concat(_this.address, ":").concat(server.address().port).concat(_this.stateSetupPath) }, (0, lodash_1.omit)(_this.config, 'handlers')), { providerBaseUrl: "".concat(_this.address, ":").concat(server.address().port) });
            logger_1.default.trace("Verifying pacts with: ".concat(JSON.stringify(opts)));
            return pact_core_1.default.verifyPacts(opts);
        };
    };
    Verifier.prototype.isLocalVerification = function () {
        var u = new url.URL(this.config.providerBaseUrl);
        return (net_1.localAddresses.includes(u.host) || net_1.localAddresses.includes(u.hostname));
    };
    return Verifier;
}());
exports.Verifier = Verifier;
//# sourceMappingURL=verifier.js.map