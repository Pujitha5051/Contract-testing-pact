export interface PactStandalone {
    cwd: string;
    brokerPath: string;
    brokerFullPath: string;
    mockServicePath: string;
    mockServiceFullPath: string;
    stubPath: string;
    stubFullPath: string;
    verifierPath: string;
    verifierFullPath: string;
    messagePath: string;
    messageFullPath: string;
    pactPath: string;
    pactFullPath: string;
    pactflowPath: string;
    pactflowFullPath: string;
}
export declare const standalone: (platform?: string, arch?: string) => PactStandalone;
declare const _default: PactStandalone;
export default _default;
