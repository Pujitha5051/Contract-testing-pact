/**
 * @module Message
 */
/// <reference types="node" />
import { AnyJson } from './common/jsonTypes';
import { AnyTemplate } from './dsl/matchers';
import { Metadata, Message, MessageConsumer, ProviderState } from './dsl/message';
import { MessageConsumerOptions } from './dsl/options';
/**
 * A Message Consumer is analagous to a Provider in the HTTP Interaction model.
 * It is the receiver of an interaction, and needs to be able to handle whatever
 * request was provided.
 */
export declare class MessageConsumerPact {
    private config;
    private state;
    private pact;
    private message;
    constructor(config: MessageConsumerOptions);
    /**
     * Gives a state the provider should be in for this Message.
     *
     * @param {string} state - The state of the provider.
     * @returns {Message} MessageConsumer
     */
    given(state: string | ProviderState): MessageConsumerPact;
    /**
     * A free style description of the Message.
     *
     * @param {string} description - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    expectsToReceive(description: string): MessageConsumerPact;
    /**
     * The JSON object to be received by the message consumer.
     *
     * May be a JSON object or JSON primitive. The contents must be able to be properly
     * strigified and parse (i.e. via JSON.stringify and JSON.parse).
     *
     * @param {string} content - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    withContent(content: AnyTemplate): MessageConsumerPact;
    /**
     * The text content to be received by the message consumer.
     *
     * May be any text
     *
     * @param {string} content - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    withTextContent(content: string, contentType: string): MessageConsumerPact;
    /**
     * The binary content to be received by the message consumer.
     *
     * Content will be stored in base64 in the resulting pact file.
     *
     * @param {Buffer} content - A buffer containing the binary content
     * @param {String} contenttype - The mime type of the content to expect
     * @returns {Message} MessageConsumer
     */
    withBinaryContent(content: Buffer, contentType: string): MessageConsumerPact;
    /**
     * Message metadata.
     *
     * @param {string} metadata -
     * @returns {Message} MessageConsumer
     */
    withMetadata(metadata: Metadata): MessageConsumerPact;
    /**
     * Creates a new Pact _message_ interaction to build a testable interaction.
     *
     * @param handler A message handler, that must be able to consume the given Message
     * @returns {Promise}
     */
    verify(handler: MessageConsumer): Promise<unknown>;
    private reifiedContent;
    /**
     * Returns the Message object created.
     *
     * @returns {Message}
     */
    json(): Message;
}
export declare function synchronousBodyHandler<R>(handler: (body: AnyJson | Buffer) => R): MessageConsumer;
export declare function asynchronousBodyHandler<R>(handler: (body: AnyJson | Buffer) => Promise<R>): MessageConsumer;
