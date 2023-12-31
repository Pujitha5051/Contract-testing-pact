"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCrashAndThrow = exports.logErrorAndThrow = exports.verboseIsImplied = exports.getLogLevel = exports.setLogLevel = exports.DEFAULT_LOG_LEVEL = void 0;
const crashMessage_1 = require("./crashMessage");
const pino_1 = require("./pino");
const pkg = require('../../package.json');
const logContext = `pact-core@${pkg.version}`;
let currentLogLevel = 'info';
let logger = (0, pino_1.createLogger)(currentLogLevel);
exports.DEFAULT_LOG_LEVEL = 'info';
const setLogLevel = (level = 'info') => {
    currentLogLevel = level;
    logger = (0, pino_1.createLogger)(currentLogLevel);
};
exports.setLogLevel = setLogLevel;
const getLogLevel = () => currentLogLevel;
exports.getLogLevel = getLogLevel;
const verboseIsImplied = () => currentLogLevel === 'trace' || currentLogLevel === 'debug';
exports.verboseIsImplied = verboseIsImplied;
const addContext = (context, message) => `${context}: ${message}`;
const logFunctions = {
    pactCrash: (message, context = logContext) => logger.error(addContext(context, (0, crashMessage_1.pactCrashMessage)(message))),
    error: (message, context = logContext) => logger.error(addContext(context, message)),
    warn: (message, context = logContext) => logger.warn(addContext(context, message)),
    info: (message, context = logContext) => logger.info(addContext(context, message)),
    debug: (message, context = logContext) => logger.debug(addContext(context, message)),
    trace: (message, context = logContext) => logger.trace(addContext(context, message)),
};
const logErrorAndThrow = (message, context) => {
    logger.error(message, context);
    throw new Error(message);
};
exports.logErrorAndThrow = logErrorAndThrow;
const logCrashAndThrow = (message, context) => {
    logFunctions.pactCrash(message, context);
    throw new Error(message);
};
exports.logCrashAndThrow = logCrashAndThrow;
exports.default = logFunctions;
//# sourceMappingURL=index.js.map