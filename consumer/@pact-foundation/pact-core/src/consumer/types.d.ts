/// <reference types="node" />
export declare type MatchingResult = MatchingResultSuccess | MatchingResultRequestMismatch | MatchingResultRequestNotFound | MatchingResultMissingRequest | MatchingResultPlugin;
export declare type MatchingResultSuccess = {
    type: 'request-match';
};
export declare type MatchingResultRequestMismatch = {
    type: 'request-mismatch';
    method: string;
    path: string;
    mismatches: Mismatch[];
};
export declare type MatchingResultRequestNotFound = {
    type: 'request-not-found';
    method: string;
    path: string;
    request: RequestMismatch;
};
export declare type MatchingResultMissingRequest = {
    type: 'missing-request';
    method: string;
    path: string;
    request: RequestMismatch;
};
export declare type MatchingResultPlugin = {
    error: string;
    path?: string;
    mismatches: PluginContentMismatch[];
};
export declare type Mismatch = MethodMismatch | PathMismatch | StatusMismatch | QueryMismatch | HeaderMismatch | BodyTypeMismatch | BodyMismatch | MetadataMismatch | PluginContentMismatch;
export declare type MethodMismatch = {
    type: 'MethodMismatch';
    expected: string;
    actual: string;
};
export declare type PathMismatch = {
    type: 'PathMismatch';
    expected: string;
    actual: string;
    mismatch: string;
};
export declare type StatusMismatch = {
    type: 'StatusMismatch';
    expected: string;
    actual: string;
    mismatch: string;
};
export declare type QueryMismatch = {
    type: 'QueryMismatch';
    parameter: string;
    expected: string;
    actual: string;
    mismatch: string;
};
export declare type HeaderMismatch = {
    type: 'HeaderMismatch';
    key: string;
    expected: string;
    actual: string;
    mismatch: string;
};
export declare type BodyTypeMismatch = {
    type: 'BodyTypeMismatch';
    expected: string;
    actual: string;
    mismatch: string;
    expectedBody?: string;
    actualBody?: string;
};
export declare type BodyMismatch = {
    type: 'BodyMismatch';
    path: string;
    expected?: string;
    actual?: string;
    mismatch: string;
};
export declare type MetadataMismatch = {
    type: 'MetadataMismatch';
    key: string;
    expected: string;
    actual: string;
    mismatch: string;
};
export declare type RequestMismatch = {
    method?: string;
    path?: string;
    headers?: Record<string, Array<string>>;
    query?: Record<string, Array<string>>;
    body?: string;
};
export declare type PluginContentMismatch = {
    path: string;
    expected?: string;
    actual?: string;
    mismatch: string;
    diff?: string;
};
export declare type PluginInteraction = RequestPluginInteraction & ResponsePluginInteraction & RequestResponsePluginInteraction;
export declare type RequestPluginInteraction = {
    withPluginRequestInteractionContents: (contentType: string, contents: string) => boolean;
};
export declare type ResponsePluginInteraction = {
    withPluginResponseInteractionContents: (contentType: string, contents: string) => boolean;
};
export declare type RequestResponsePluginInteraction = {
    withPluginRequestResponseInteractionContents: (contentType: string, contents: string) => boolean;
};
export declare type PluginPact = {
    addPlugin: (plugin: string, version: string) => void;
    cleanupPlugins: () => void;
    cleanupMockServer: (port: number) => boolean;
};
export declare type ConsumerInteraction = PluginInteraction & {
    uponReceiving: (description: string) => boolean;
    given: (state: string) => boolean;
    givenWithParam: (state: string, name: string, value: string) => boolean;
    withRequest: (method: string, path: string) => boolean;
    withQuery: (name: string, index: number, value: string) => boolean;
    withStatus: (status: number) => boolean;
    withRequestHeader: (name: string, index: number, value: string) => boolean;
    withRequestBody: (body: string, contentType: string) => boolean;
    withRequestBinaryBody: (body: Buffer, contentType: string) => boolean;
    withRequestMultipartBody: (contentType: string, filename: string, mimePartName: string) => boolean;
    withResponseHeader: (name: string, index: number, value: string) => boolean;
    withResponseBody: (body: string, contentType: string) => boolean;
    withResponseBinaryBody: (body: Buffer, contentType: string) => boolean;
    withResponseMultipartBody: (contentType: string, filename: string, mimePartName: string) => boolean;
};
export declare type ConsumerPact = PluginPact & {
    newInteraction: (description: string) => ConsumerInteraction;
    newAsynchronousMessage: (description: string) => AsynchronousMessage;
    newSynchronousMessage: (description: string) => SynchronousMessage;
    pactffiCreateMockServerForTransport: (address: string, transport: string, config: string, port?: number) => number;
    createMockServer: (address: string, port?: number, tls?: boolean) => number;
    mockServerMismatches: (port: number) => MatchingResult[];
    cleanupMockServer: (port: number) => boolean;
    writePactFile: (dir: string, merge?: boolean) => void;
    writePactFileForPluginServer: (port: number, dir: string, merge?: boolean) => void;
    mockServerMatchedSuccessfully: (port: number) => boolean;
    addMetadata: (namespace: string, name: string, value: string) => boolean;
};
export declare type AsynchronousMessage = RequestPluginInteraction & {
    given: (state: string) => void;
    givenWithParam: (state: string, name: string, value: string) => void;
    expectsToReceive: (description: string) => void;
    withMetadata: (name: string, value: string) => void;
    withContents: (body: string, contentType: string) => void;
    withBinaryContents: (body: Buffer, contentType: string) => void;
    reifyMessage: () => string;
};
export declare type ConsumerMessage = AsynchronousMessage;
export declare type SynchronousMessage = PluginInteraction & {
    given: (state: string) => void;
    givenWithParam: (state: string, name: string, value: string) => void;
    withMetadata: (name: string, value: string) => void;
    withRequestContents: (body: string, contentType: string) => void;
    withResponseContents: (body: string, contentType: string) => void;
    withRequestBinaryContents: (body: Buffer, contentType: string) => void;
    withResponseBinaryContents: (body: Buffer, contentType: string) => void;
};
export declare type ConsumerMessagePact = PluginPact & {
    newMessage: (description: string) => AsynchronousMessage;
    newAsynchronousMessage: (description: string) => AsynchronousMessage;
    newSynchronousMessage: (description: string) => SynchronousMessage;
    pactffiCreateMockServerForTransport: (address: string, transport: string, config: string, port?: number) => number;
    writePactFile: (dir: string, merge?: boolean) => void;
    writePactFileForPluginServer: (port: number, dir: string, merge?: boolean) => void;
    addMetadata: (namespace: string, name: string, value: string) => boolean;
    mockServerMismatches: (port: number) => MatchingResult[];
    mockServerMatchedSuccessfully: (port: number) => boolean;
};
