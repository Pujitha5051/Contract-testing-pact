/// <reference types="node" />
export declare type FfiHandle = number;
export declare type FfiPactHandle = number;
export declare type FfiInteractionHandle = number;
export declare type FfiVerifierHandle = number;
export declare type FfiMessagePactHandle = number;
export declare type FfiMessageHandle = number;
export declare type FfiSpecificationVersion = 0 | 1 | 2 | 3 | 4 | 5;
export declare const FfiSpecificationVersion: Record<string, FfiSpecificationVersion>;
export declare type FfiWritePactResponse = 0 | 1 | 2 | 3;
export declare const FfiWritePactResponse: Record<string, FfiWritePactResponse>;
export declare type FfiWriteMessagePactResponse = 0 | 1 | 2;
export declare const FfiWriteMessagePactResponse: Record<string, FfiWriteMessagePactResponse>;
export declare type FfiConfigurePluginResponse = 0 | 1 | 2 | 3;
export declare const FfiConfigurePluginResponse: Record<string, FfiConfigurePluginResponse>;
export declare type FfiPluginInteractionResponse = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export declare const FfiPluginInteractionResponse: Record<string, FfiPluginInteractionResponse>;
export declare type FfiInteractionPart = 0 | 1;
export declare const INTERACTION_PART_REQUEST: FfiInteractionPart;
export declare const INTERACTION_PART_RESPONSE: FfiInteractionPart;
export declare const CREATE_MOCK_SERVER_ERRORS: {
    NULL_POINTER: number;
    JSON_PARSE_ERROR: number;
    MOCK_SERVER_START_FAIL: number;
    CORE_PANIC: number;
    ADDRESS_NOT_VALID: number;
    TLS_CONFIG: number;
};
export declare enum VERIFY_PROVIDER_RESPONSE {
    VERIFICATION_SUCCESSFUL = 0,
    VERIFICATION_FAILED = 1,
    NULL_POINTER_RECEIVED = 2,
    METHOD_PANICKED = 3,
    INVALID_ARGUMENTS = 4
}
export declare enum FfiFunctionResult {
    RESULT_OK = 0,
    RESULT_FAILED = 1
}
export declare enum FfiLogLevelFilter {
    LOG_LEVEL_OFF = 0,
    LOG_LEVEL_ERROR = 1,
    LOG_LEVEL_WARN = 2,
    LOG_LEVEL_INFO = 3,
    LOG_LEVEL_DEBUG = 4,
    LOG_LEVEL_TRACE = 5
}
export declare type Ffi = {
    pactffiInit(logLevel: string): string;
    pactffiVersion(): string;
} & FfiConsumerFunctions & FfiVerificationFunctions;
export declare type FfiConsumerFunctions = {
    pactffiCreateMockServerForPact(handle: FfiPactHandle, address: string, tls: boolean): number;
    pactffiCreateMockServerForTransport(handle: FfiPactHandle, address: string, port: number, transport: string, config: string): number;
    pactffiNewPact(consumer: string, provider: string): FfiPactHandle;
    pactffiWithSpecification(handle: FfiPactHandle, specification: FfiSpecificationVersion): boolean;
    pactffiWithPactMetadata(handle: FfiPactHandle, namespace_: string, name: string, value: string): boolean;
    pactffiNewInteraction(handle: FfiPactHandle, description: string): FfiInteractionHandle;
    pactffiUponReceiving(handle: FfiInteractionHandle, description: string): boolean;
    pactffiGiven(handle: FfiInteractionHandle, providerState: string): boolean;
    pactffiGivenWithParam(handle: FfiInteractionHandle, description: string, name: string, value: string): boolean;
    pactffiWithRequest(handle: FfiInteractionHandle, method: string, path: string): boolean;
    pactffiWithQueryParameter(handle: FfiInteractionHandle, name: string, index: number, value: string): boolean;
    pactffiWithHeader(handle: FfiInteractionHandle, part: FfiInteractionPart, name: string, index: number, value: string): boolean;
    pactffiWithBody(handle: FfiInteractionHandle, part: FfiInteractionPart, contentType: string, body: string): boolean;
    pactffiWithBinaryFile(handle: FfiInteractionHandle, part: FfiInteractionPart, contentType: string, body: Buffer, size: number): boolean;
    pactffiWithMultipartFile(handle: FfiInteractionHandle, part: FfiInteractionPart, contentType: string, file: string, partName: string): void;
    pactffiResponseStatus(handle: FfiInteractionHandle, status: number): boolean;
    pactffiWritePactFile(handle: FfiPactHandle, dir: string, overwrite: boolean): FfiWritePactResponse;
    pactffiWritePactFileByPort(port: number, dir: string, overwrite: boolean): FfiWritePactResponse;
    pactffiCleanupMockServer(port: number): boolean;
    pactffiMockServerMatched(port: number): boolean;
    pactffiMockServerMismatches(port: number): string;
    pactffiGetTlsCaCertificate(): string;
    pactffiLogMessage(source: string, logLevel: string, message: string): void;
    pactffiLogToBuffer(level: FfiLogLevelFilter): number;
    pactffiInitWithLogLevel(level: string): void;
    pactffiLogToStdout(level: FfiLogLevelFilter): number;
    pactffiLogToFile(fileName: string, level: FfiLogLevelFilter): number;
    pactffiFetchLogBuffer(logId: number): string;
    pactffiUsingPlugin(handle: FfiPactHandle, name: string, version: string): FfiConfigurePluginResponse;
    pactffiCleanupPlugins(handle: FfiPactHandle): void;
    pactffiPluginInteractionContents(handle: FfiInteractionHandle, part: FfiInteractionPart, contentType: string, contents: string): void;
    pactffiNewAsyncMessage(handle: FfiPactHandle, description: string): FfiMessageHandle;
    pactffiNewSyncMessage(handle: FfiPactHandle, description: string): FfiInteractionHandle;
    pactffiMessageExpectsToReceive(handle: FfiMessageHandle, description: string): void;
    pactffiMessageGiven(handle: FfiMessageHandle, description: string): void;
    pactffiMessageGivenWithParam(handle: FfiMessageHandle, description: string, key: string, value: string): void;
    pactffiMessageWithContents(handle: FfiMessageHandle, contentType: string, data: string): void;
    pactffiMessageWithBinaryContents(handle: FfiMessageHandle, contentType: string, data: Buffer, size: number): void;
    pactffiMessageWithMetadata(handle: FfiMessageHandle, key: string, value: string): void;
    pactffiMessageReify(handle: FfiMessageHandle): string;
};
export declare type FfiVerificationFunctions = {
    pactffiVerifierNewForApplication(libraryName: string, version: string): FfiVerifierHandle;
    pactffiVerifierSetProviderInfo(handle: FfiVerifierHandle, providerName: string, scheme: string, host: string, port: number, path: string): void;
    pactffiVerifierSetFilterInfo(handle: FfiVerifierHandle, description: string, state: string, noState: boolean): void;
    pactffiVerifierSetProviderState(handle: FfiVerifierHandle, url: string, teardown: boolean, body: boolean): void;
    pactffiVerifierSetVerificationOptions(handle: FfiVerifierHandle, disableSslVerification: boolean, requestTimeout: number): void;
    pactffiVerifierSetPublishOptions(handle: FfiVerifierHandle, providerVersion: string, buildUrl: string, providerTags: string[], providerVersionBranch: string): void;
    pactffiVerifierSetConsumerFilters(handle: FfiVerifierHandle, consumers: string[]): void;
    pactffiVerifierSetFailIfNoPactsFound(handle: FfiVerifierHandle, failIfNoPactsFound: boolean): void;
    pactffiVerifierAddCustomHeader(handle: FfiVerifierHandle, header: string, value: string): void;
    pactffiVerifierAddFileSource(handle: FfiVerifierHandle, file: string): void;
    pactffiVerifierAddDirectorySource(handle: FfiVerifierHandle, dir: string): void;
    pactffiVerifierUrlSource(handle: FfiVerifierHandle, url: string, username: string, password: string, token: string): void;
    pactffiVerifierBrokerSourceWithSelectors(handle: FfiVerifierHandle, url: string, username: string, password: string, token: string, enablePending: boolean, includeWipPactsSince: string, providerTags: string[], providerVersionBranch: string, consumerVersionSelectors: string[], consumerVersionTags: string[]): void;
    pactffiVerifierExecute(handle: FfiVerifierHandle, callback: (e: Error, res: number) => void): number;
    pactffiVerifierShutdown(handle: FfiVerifierHandle): void;
    pactffiVerifierAddProviderTransport(handle: FfiVerifierHandle, protocol: string, port: number, path: string, scheme: string): void;
};
