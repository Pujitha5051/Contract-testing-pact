/**
 * An Interaction is where you define the state of your interaction with a Provider.
 * @module Interaction
 */
import { HTTPMethods, HTTPMethod } from '../common/request';
import { Matcher, AnyTemplate } from './matchers';
interface QueryObject {
    [name: string]: string | Matcher<string> | string[];
}
export declare type Query = string | QueryObject;
export declare type Headers = {
    [header: string]: string | Matcher<string>;
};
export interface RequestOptions {
    method: HTTPMethods | HTTPMethod;
    path: string | Matcher<string>;
    query?: Query;
    headers?: Headers;
    body?: AnyTemplate;
}
export interface ResponseOptions {
    status: number;
    headers?: Headers;
    body?: AnyTemplate;
}
export interface InteractionObject {
    state: string | undefined;
    uponReceiving: string;
    withRequest: RequestOptions;
    willRespondWith: ResponseOptions;
}
export interface InteractionState {
    providerState?: string;
    description?: string;
    request?: RequestOptions;
    response?: ResponseOptions;
}
export interface InteractionStateComplete {
    providerState?: string;
    description: string;
    request: RequestOptions;
    response: ResponseOptions;
}
export declare class Interaction {
    protected state: InteractionState;
    /**
     * Gives a state the provider should be in for this interaction.
     * @param {string} providerState - The state of the provider.
     * @returns {Interaction} interaction
     */
    given(providerState: string): this;
    /**
     * A free style description of the interaction.
     * @param {string} description - A description of the interaction.
     * @returns {Interaction} interaction
     */
    uponReceiving(description: string): this;
    /**
     * The request that represents this interaction triggered by the consumer.
     * @param {Object} requestOpts
     * @param {string} requestOpts.method - The HTTP method
     * @param {string} requestOpts.path - The path of the URL
     * @param {string} requestOpts.query - Any query string in the interaction
     * @param {Object} requestOpts.headers - A key-value pair oject of headers
     * @param {Object} requestOpts.body - The body, in {@link String} format or {@link Object} format
     * @returns {Interaction} interaction
     */
    withRequest(requestOpts: RequestOptions): this;
    /**
     * The response expected by the consumer.
     * @param {Object} responseOpts
     * @param {string} responseOpts.status - The HTTP status
     * @param {string} responseOpts.headers
     * @param {Object} responseOpts.body
     * @returns {Interaction} interaction
     */
    willRespondWith(responseOpts: ResponseOptions): this;
    /**
     * Returns the interaction object created.
     * @returns {Object}
     */
    json(): InteractionStateComplete;
}
export declare const interactionToInteractionObject: (interaction: InteractionStateComplete) => InteractionObject;
export {};
