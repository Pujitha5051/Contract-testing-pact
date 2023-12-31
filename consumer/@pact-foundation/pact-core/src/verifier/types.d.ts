import { LogLevel } from '../logger/types';
export interface ConsumerVersionSelector {
    tag?: string;
    latest?: boolean;
    consumer?: string;
    deployedOrReleased?: boolean;
    deployed?: boolean;
    released?: boolean;
    environment?: string;
    fallbackTag?: string;
    branch?: string;
    mainBranch?: boolean;
    matchingBranch?: boolean;
}
export declare type CustomHeaders = {
    [header: string]: string;
};
export interface Transport {
    protocol: string;
    port: number;
    scheme?: string;
    path?: string;
}
export interface VerifierOptions {
    providerBaseUrl: string;
    provider?: string;
    pactUrls?: string[];
    pactBrokerUrl?: string;
    pactBrokerUsername?: string;
    pactBrokerPassword?: string;
    pactBrokerToken?: string;
    consumerVersionTags?: string[];
    providerVersionTags?: string[];
    providerVersionBranch?: string;
    providerStatesSetupUrl?: string;
    providerStatesSetupTeardown?: boolean;
    providerStatesSetupBody?: boolean;
    publishVerificationResult?: boolean;
    providerVersion?: string;
    enablePending?: boolean;
    includeWipPactsSince?: string;
    consumerVersionSelectors?: ConsumerVersionSelector[];
    timeout?: number;
    logLevel?: LogLevel;
    disableSslVerification?: boolean;
    buildUrl?: string;
    customProviderHeaders?: CustomHeaders | string[];
    consumerFilters?: string[];
    transports?: Transport[];
    providerBranch?: string;
    failIfNoPactsFound?: boolean;
}
