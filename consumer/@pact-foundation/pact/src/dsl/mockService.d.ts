export declare type PactfileWriteMode = 'overwrite' | 'update' | 'merge';
export interface Pacticipant {
    name: string;
}
export interface PactDetails {
    consumer?: Pacticipant;
    provider?: Pacticipant;
    pactfile_write_mode: PactfileWriteMode;
}
export interface MockService {
    pactDetails: PactDetails;
    baseUrl: string;
}
