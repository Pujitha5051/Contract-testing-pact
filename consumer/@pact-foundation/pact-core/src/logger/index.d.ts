import { LogLevel } from './types';
export declare const DEFAULT_LOG_LEVEL = "info";
export declare const setLogLevel: (level?: LogLevel) => void;
export declare const getLogLevel: () => LogLevel;
export declare const verboseIsImplied: () => boolean;
declare const logFunctions: {
    pactCrash: (message: string, context?: string) => void;
    error: (message: string, context?: string) => void;
    warn: (message: string, context?: string) => void;
    info: (message: string, context?: string) => void;
    debug: (message: string, context?: string) => void;
    trace: (message: string, context?: string) => void;
};
export declare const logErrorAndThrow: (message: string, context?: string) => never;
export declare const logCrashAndThrow: (message: string, context?: string) => never;
export default logFunctions;
