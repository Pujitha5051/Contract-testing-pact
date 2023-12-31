"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FfiLogLevelFilter = exports.FfiFunctionResult = exports.VERIFY_PROVIDER_RESPONSE = exports.CREATE_MOCK_SERVER_ERRORS = exports.INTERACTION_PART_RESPONSE = exports.INTERACTION_PART_REQUEST = exports.FfiPluginInteractionResponse = exports.FfiConfigurePluginResponse = exports.FfiWriteMessagePactResponse = exports.FfiWritePactResponse = exports.FfiSpecificationVersion = void 0;
exports.FfiSpecificationVersion = {
    SPECIFICATION_VERSION_UNKNOWN: 0,
    SPECIFICATION_VERSION_V1: 1,
    SPECIFICATION_VERSION_V1_1: 2,
    SPECIFICATION_VERSION_V2: 3,
    SPECIFICATION_VERSION_V3: 4,
    SPECIFICATION_VERSION_V4: 5,
};
exports.FfiWritePactResponse = {
    SUCCESS: 0,
    GENERAL_PANIC: 1,
    UNABLE_TO_WRITE_PACT_FILE: 2,
    MOCK_SERVER_NOT_FOUND: 3,
};
exports.FfiWriteMessagePactResponse = {
    SUCCESS: 0,
    UNABLE_TO_WRITE_PACT_FILE: 1,
    MESSAGE_HANDLE_INVALID: 2,
};
exports.FfiConfigurePluginResponse = {
    SUCCESS: 0,
    GENERAL_PANIC: 1,
    FAILED_TO_LOAD_PLUGIN: 2,
    PACT_HANDLE_INVALID: 3,
};
exports.FfiPluginInteractionResponse = {
    SUCCESS: 0,
    A_GENERAL_PANIC_WAS_CAUGHT: 1,
    MOCK_SERVER_HAS_ALREADY_BEEN_STARTED: 2,
    INTERACTION_HANDLE_IS_INVALID: 3,
    CONTENT_TYPE_IS_NOT_VALID: 4,
    CONTENTS_JSON_IS_NOT_VALID_JSON: 5,
    PLUGIN_RETURNED_AN_ERROR: 6,
};
exports.INTERACTION_PART_REQUEST = 0;
exports.INTERACTION_PART_RESPONSE = 1;
exports.CREATE_MOCK_SERVER_ERRORS = {
    NULL_POINTER: -1,
    JSON_PARSE_ERROR: -2,
    MOCK_SERVER_START_FAIL: -3,
    CORE_PANIC: -4,
    ADDRESS_NOT_VALID: -5,
    TLS_CONFIG: -6,
};
var VERIFY_PROVIDER_RESPONSE;
(function (VERIFY_PROVIDER_RESPONSE) {
    VERIFY_PROVIDER_RESPONSE[VERIFY_PROVIDER_RESPONSE["VERIFICATION_SUCCESSFUL"] = 0] = "VERIFICATION_SUCCESSFUL";
    VERIFY_PROVIDER_RESPONSE[VERIFY_PROVIDER_RESPONSE["VERIFICATION_FAILED"] = 1] = "VERIFICATION_FAILED";
    VERIFY_PROVIDER_RESPONSE[VERIFY_PROVIDER_RESPONSE["NULL_POINTER_RECEIVED"] = 2] = "NULL_POINTER_RECEIVED";
    VERIFY_PROVIDER_RESPONSE[VERIFY_PROVIDER_RESPONSE["METHOD_PANICKED"] = 3] = "METHOD_PANICKED";
    VERIFY_PROVIDER_RESPONSE[VERIFY_PROVIDER_RESPONSE["INVALID_ARGUMENTS"] = 4] = "INVALID_ARGUMENTS";
})(VERIFY_PROVIDER_RESPONSE = exports.VERIFY_PROVIDER_RESPONSE || (exports.VERIFY_PROVIDER_RESPONSE = {}));
var FfiFunctionResult;
(function (FfiFunctionResult) {
    FfiFunctionResult[FfiFunctionResult["RESULT_OK"] = 0] = "RESULT_OK";
    FfiFunctionResult[FfiFunctionResult["RESULT_FAILED"] = 1] = "RESULT_FAILED";
})(FfiFunctionResult = exports.FfiFunctionResult || (exports.FfiFunctionResult = {}));
var FfiLogLevelFilter;
(function (FfiLogLevelFilter) {
    FfiLogLevelFilter[FfiLogLevelFilter["LOG_LEVEL_OFF"] = 0] = "LOG_LEVEL_OFF";
    FfiLogLevelFilter[FfiLogLevelFilter["LOG_LEVEL_ERROR"] = 1] = "LOG_LEVEL_ERROR";
    FfiLogLevelFilter[FfiLogLevelFilter["LOG_LEVEL_WARN"] = 2] = "LOG_LEVEL_WARN";
    FfiLogLevelFilter[FfiLogLevelFilter["LOG_LEVEL_INFO"] = 3] = "LOG_LEVEL_INFO";
    FfiLogLevelFilter[FfiLogLevelFilter["LOG_LEVEL_DEBUG"] = 4] = "LOG_LEVEL_DEBUG";
    FfiLogLevelFilter[FfiLogLevelFilter["LOG_LEVEL_TRACE"] = 5] = "LOG_LEVEL_TRACE";
})(FfiLogLevelFilter = exports.FfiLogLevelFilter || (exports.FfiLogLevelFilter = {}));
//# sourceMappingURL=types.js.map