"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeConsumerAsyncMessagePact = exports.makeConsumerMessagePact = exports.makeConsumerPact = void 0;
const types_1 = require("../ffi/types");
const logger_1 = require("../logger");
const checkErrors_1 = require("./checkErrors");
const ffi_1 = require("../ffi");
const internals_1 = require("./internals");
const asyncMessage = (ffi, interactionPtr) => ({
    withPluginRequestInteractionContents: (contentType, contents) => {
        ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
        return true;
    },
    expectsToReceive: (description) => ffi.pactffiMessageExpectsToReceive(interactionPtr, description),
    given: (state) => ffi.pactffiMessageGiven(interactionPtr, state),
    givenWithParam: (state, name, value) => ffi.pactffiMessageGivenWithParam(interactionPtr, state, name, value),
    withContents: (body, contentType) => ffi.pactffiMessageWithContents(interactionPtr, contentType, body),
    withBinaryContents: (body, contentType) => ffi.pactffiMessageWithBinaryContents(interactionPtr, contentType, body, body.length),
    reifyMessage: () => ffi.pactffiMessageReify(interactionPtr),
    withMetadata: (name, value) => ffi.pactffiMessageWithMetadata(interactionPtr, name, value),
});
const makeConsumerPact = (consumer, provider, version = 3, logLevel = (0, logger_1.getLogLevel)()) => {
    const ffi = (0, ffi_1.getFfiLib)(logLevel);
    if (logLevel) {
        (0, logger_1.setLogLevel)(logLevel);
    }
    const pactPtr = ffi.pactffiNewPact(consumer, provider);
    if (!ffi.pactffiWithSpecification(pactPtr, version)) {
        throw new Error(`Unable to set core spec version. The pact FfiSpecificationVersion '${version}' may be invalid (note this is not the same as the pact spec version)`);
    }
    return {
        addPlugin: (name, pluginVersion) => {
            ffi.pactffiUsingPlugin(pactPtr, name, pluginVersion);
        },
        cleanupPlugins: () => {
            ffi.pactffiCleanupPlugins(pactPtr);
        },
        createMockServer: (address, requestedPort, tls = false) => {
            const port = ffi.pactffiCreateMockServerForPact(pactPtr, `${address}:${requestedPort || 0}`, tls);
            const error = Object.keys(types_1.CREATE_MOCK_SERVER_ERRORS).find((key) => types_1.CREATE_MOCK_SERVER_ERRORS[key] === port);
            if (error) {
                if (error === 'ADDRESS_NOT_VALID') {
                    (0, logger_1.logErrorAndThrow)(`Unable to start mock server at '${address}'. Is the address and port valid?`);
                }
                if (error === 'TLS_CONFIG') {
                    (0, logger_1.logErrorAndThrow)(`Unable to create TLS configuration with self-signed certificate`);
                }
                (0, logger_1.logCrashAndThrow)(`The pact core couldn't create the mock server because of an error described by '${error}'`);
            }
            if (port <= 0) {
                (0, logger_1.logCrashAndThrow)(`The pact core returned an unhandled error code '${port}'`);
            }
            return port;
        },
        mockServerMatchedSuccessfully: (port) => ffi.pactffiMockServerMatched(port),
        mockServerMismatches: (port) => (0, internals_1.mockServerMismatches)(ffi, port),
        cleanupMockServer: (mockServerPort) => (0, checkErrors_1.wrapWithCheck)((port) => ffi.pactffiCleanupMockServer(port), 'cleanupMockServer')(mockServerPort),
        writePactFile: (dir, merge = true) => (0, internals_1.writePact)(ffi, pactPtr, dir, merge),
        writePactFileForPluginServer: (port, dir, merge = true) => (0, internals_1.writePact)(ffi, pactPtr, dir, merge, port),
        addMetadata: (namespace, name, value) => ffi.pactffiWithPactMetadata(pactPtr, namespace, name, value),
        newAsynchronousMessage: (description) => {
            const interactionPtr = ffi.pactffiNewAsyncMessage(pactPtr, description);
            return asyncMessage(ffi, interactionPtr);
        },
        newSynchronousMessage: (description) => {
            const interactionPtr = ffi.pactffiNewSyncMessage(pactPtr, description);
            return {
                withPluginRequestInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
                    return true;
                },
                withPluginResponseInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, contents);
                    return true;
                },
                withPluginRequestResponseInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
                    return true;
                },
                given: (state) => ffi.pactffiGiven(interactionPtr, state),
                givenWithParam: (state, name, value) => ffi.pactffiGivenWithParam(interactionPtr, state, name, value),
                withRequestContents: (body, contentType) => ffi.pactffiWithBody(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, body),
                withResponseContents: (body, contentType) => ffi.pactffiWithBody(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, body),
                withRequestBinaryContents: (body, contentType) => ffi.pactffiWithBinaryFile(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, body, body.length),
                withResponseBinaryContents: (body, contentType) => ffi.pactffiWithBinaryFile(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, body, body.length),
                withMetadata: (name, value) => ffi.pactffiMessageWithMetadata(interactionPtr, name, value),
            };
        },
        pactffiCreateMockServerForTransport(address, transport, config, port) {
            return ffi.pactffiCreateMockServerForTransport(pactPtr, address, port || 0, transport, config);
        },
        newInteraction: (interactionDescription) => {
            const interactionPtr = ffi.pactffiNewInteraction(pactPtr, interactionDescription);
            return (0, checkErrors_1.wrapAllWithCheck)({
                uponReceiving: (recieveDescription) => ffi.pactffiUponReceiving(interactionPtr, recieveDescription),
                given: (state) => ffi.pactffiGiven(interactionPtr, state),
                givenWithParam: (state, name, value) => ffi.pactffiGivenWithParam(interactionPtr, state, name, value),
                withRequest: (method, path) => ffi.pactffiWithRequest(interactionPtr, method, path),
                withQuery: (name, index, value) => ffi.pactffiWithQueryParameter(interactionPtr, name, index, value),
                withRequestHeader: (name, index, value) => ffi.pactffiWithHeader(interactionPtr, types_1.INTERACTION_PART_REQUEST, name, index, value),
                withRequestBody: (body, contentType) => ffi.pactffiWithBody(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, body),
                withRequestBinaryBody: (body, contentType) => ffi.pactffiWithBinaryFile(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, body, body.length),
                withRequestMultipartBody: (contentType, filename, mimePartName) => ffi.pactffiWithMultipartFile(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, filename, mimePartName) === undefined,
                withResponseHeader: (name, index, value) => ffi.pactffiWithHeader(interactionPtr, types_1.INTERACTION_PART_RESPONSE, name, index, value),
                withResponseBody: (body, contentType) => ffi.pactffiWithBody(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, body),
                withResponseBinaryBody: (body, contentType) => ffi.pactffiWithBinaryFile(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, body, body.length),
                withResponseMultipartBody: (contentType, filename, mimePartName) => ffi.pactffiWithMultipartFile(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, filename, mimePartName) === undefined,
                withStatus: (status) => ffi.pactffiResponseStatus(interactionPtr, status),
                withPluginRequestInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
                    return true;
                },
                withPluginRequestResponseInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
                    return true;
                },
                withPluginResponseInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, contents);
                    return true;
                },
            });
        },
    };
};
exports.makeConsumerPact = makeConsumerPact;
const makeConsumerMessagePact = (consumer, provider, version = 4, logLevel = (0, logger_1.getLogLevel)()) => {
    const ffi = (0, ffi_1.getFfiLib)(logLevel);
    if (logLevel) {
        (0, logger_1.setLogLevel)(logLevel);
    }
    const pactPtr = ffi.pactffiNewPact(consumer, provider);
    if (!ffi.pactffiWithSpecification(pactPtr, version) || version < 4) {
        throw new Error(`Unable to set core spec version. The pact FfiSpecificationVersion '${version}' may be invalid (note this is not the same as the pact spec version). It should be set to at least 3`);
    }
    return {
        addPlugin: (name, pluginVersion) => {
            ffi.pactffiUsingPlugin(pactPtr, name, pluginVersion);
        },
        cleanupPlugins: () => {
            ffi.pactffiCleanupPlugins(pactPtr);
        },
        cleanupMockServer: (mockServerPort) => (0, checkErrors_1.wrapWithCheck)((port) => ffi.pactffiCleanupMockServer(port), 'cleanupMockServer')(mockServerPort),
        writePactFile: (dir, merge = true) => (0, internals_1.writePact)(ffi, pactPtr, dir, merge),
        writePactFileForPluginServer: (port, dir, merge = true) => (0, internals_1.writePact)(ffi, pactPtr, dir, merge, port),
        addMetadata: (namespace, name, value) => ffi.pactffiWithPactMetadata(pactPtr, namespace, name, value),
        newMessage: (description) => {
            const interactionPtr = ffi.pactffiNewAsyncMessage(pactPtr, description);
            return asyncMessage(ffi, interactionPtr);
        },
        newAsynchronousMessage: (description) => {
            const interactionPtr = ffi.pactffiNewAsyncMessage(pactPtr, description);
            return asyncMessage(ffi, interactionPtr);
        },
        newSynchronousMessage: (description) => {
            const interactionPtr = ffi.pactffiNewSyncMessage(pactPtr, description);
            return {
                withPluginRequestInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
                    return true;
                },
                withPluginResponseInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, contents);
                    return true;
                },
                withPluginRequestResponseInteractionContents: (contentType, contents) => {
                    ffi.pactffiPluginInteractionContents(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, contents);
                    return true;
                },
                given: (state) => ffi.pactffiGiven(interactionPtr, state),
                givenWithParam: (state, name, value) => ffi.pactffiGivenWithParam(interactionPtr, state, name, value),
                withRequestContents: (body, contentType) => ffi.pactffiWithBody(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, body),
                withResponseContents: (body, contentType) => ffi.pactffiWithBody(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, body),
                withRequestBinaryContents: (body, contentType) => ffi.pactffiWithBinaryFile(interactionPtr, types_1.INTERACTION_PART_REQUEST, contentType, body, body.length),
                withResponseBinaryContents: (body, contentType) => ffi.pactffiWithBinaryFile(interactionPtr, types_1.INTERACTION_PART_RESPONSE, contentType, body, body.length),
                withMetadata: (name, value) => ffi.pactffiMessageWithMetadata(interactionPtr, name, value),
            };
        },
        pactffiCreateMockServerForTransport(address, transport, config, port) {
            return ffi.pactffiCreateMockServerForTransport(pactPtr, address, port || 0, transport, config);
        },
        mockServerMatchedSuccessfully: (port) => ffi.pactffiMockServerMatched(port),
        mockServerMismatches: (port) => (0, internals_1.mockServerMismatches)(ffi, port),
    };
};
exports.makeConsumerMessagePact = makeConsumerMessagePact;
exports.makeConsumerAsyncMessagePact = exports.makeConsumerMessagePact;
//# sourceMappingURL=index.js.map