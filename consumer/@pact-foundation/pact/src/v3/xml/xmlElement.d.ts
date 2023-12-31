import { Matcher } from '../matchers';
import { XmlNode } from './xmlNode';
export declare type XmlAttributes = Map<string, string>;
export declare type XmlCallback = (n: XmlElement) => void;
export declare class XmlElement extends XmlNode {
    name: string;
    private attributes;
    private children;
    constructor(name: string);
    setName(name: string): XmlElement;
    setAttributes(attributes: XmlAttributes): XmlElement;
    /**
     * Creates a new element with the given name and attributes and then sets it's text content (can be a matcher)
     * @param name Element name
     * @param attributes Map of element attributes
     * @param arg Callback to configure the new element, or text content to create the new element with (can be a matcher)
     */
    appendElement(name: string, attributes: XmlAttributes, arg?: string | XmlCallback | Matcher<string>): XmlElement;
    appendText(content: string | Matcher<string>): XmlElement;
    eachLike(name: string, attributes: XmlAttributes, cb?: XmlCallback, options?: EachLikeOptions): XmlElement;
}
interface EachLikeOptions {
    min?: number;
    max?: number;
    examples?: number;
}
export {};
