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
exports.verify = void 0;
const logger_1 = __importStar(require("../logger"));
const ffi_1 = require("../ffi");
const types_1 = require("../ffi/types");
const argumentMapper_1 = require("./argumentMapper");
const pkg = require('../../package.json');
const verify = (opts) => {
    const ffi = (0, ffi_1.getFfiLib)(opts.logLevel);
    if (opts.logLevel) {
        (0, logger_1.setLogLevel)(opts.logLevel);
    }
    const handle = ffi.pactffiVerifierNewForApplication(pkg.name.split('/')[1], pkg.version);
    (0, argumentMapper_1.setupVerification)(ffi, handle, opts);
    return new Promise((resolve, reject) => {
        ffi.pactffiVerifierExecute(handle, (err, res) => {
            logger_1.default.debug(`shutting down verifier with handle ${handle}`);
            ffi.pactffiVerifierShutdown(handle);
            logger_1.default.debug(`response from verifier: ${err}, ${res}`);
            if (err) {
                if (typeof err === 'string') {
                    logger_1.default.error(err);
                }
                else if (err.message) {
                    logger_1.default.error(err.message);
                }
                logger_1.default.pactCrash('The underlying pact core returned an error through the ffi interface');
                reject(err);
            }
            else {
                switch (res) {
                    case types_1.VERIFY_PROVIDER_RESPONSE.VERIFICATION_SUCCESSFUL:
                        logger_1.default.info('Verification successful');
                        resolve(`finished: ${res}`);
                        break;
                    case types_1.VERIFY_PROVIDER_RESPONSE.VERIFICATION_FAILED:
                        logger_1.default.error('Verification unsuccessful');
                        reject(new Error('Verfication failed'));
                        break;
                    case types_1.VERIFY_PROVIDER_RESPONSE.INVALID_ARGUMENTS:
                        logger_1.default.pactCrash('The underlying pact core was invoked incorrectly.');
                        reject(new Error('Verification was unable to run'));
                        break;
                    default:
                        logger_1.default.pactCrash('The underlying pact core crashed in an unexpected way.');
                        reject(new Error('Pact core crashed'));
                        break;
                }
            }
        });
    });
};
exports.verify = verify;
//# sourceMappingURL=nativeVerifier.js.map