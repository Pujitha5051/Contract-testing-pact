import * as express from 'express';
import { LogLevel } from '../../options';
import { JsonMap, AnyJson } from '../../../common/jsonTypes';
export declare type Hook = () => Promise<unknown>;
/**
 * State handlers map a state description to a function
 * that can setup the provider state
 */
export interface StateHandlers {
    [name: string]: StateHandler;
}
/**
 * Incoming provider state request
 */
export interface ProviderState {
    action: StateAction;
    params: JsonMap;
    state: string;
}
/**
 * Specifies whether the state handler being setup or shutdown
 */
export declare type StateAction = 'setup' | 'teardown';
/**
 * Respond to the state setup event, optionally returning a map of provider
 * values to dynamically inject into the incoming request to test
 */
export declare type StateFunc = (parameters?: AnyJson) => Promise<JsonMap | void>;
/**
 * Respond to the state setup event, with the ability to hook into the setup/teardown
 * phase of the state
 */
export declare type StateFuncWithSetup = {
    setup?: StateFunc;
    teardown?: StateFunc;
};
export declare type StateHandler = StateFuncWithSetup | StateFunc;
export interface ProxyOptions {
    logLevel?: LogLevel;
    requestFilter?: express.RequestHandler;
    stateHandlers?: StateHandlers;
    beforeEach?: Hook;
    afterEach?: Hook;
    validateSSL?: boolean;
    changeOrigin?: boolean;
    providerBaseUrl: string;
    proxyHost?: string;
}
