"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlElement = void 0;
var xmlNode_1 = require("./xmlNode");
var xmlText_1 = require("./xmlText");
var modifyElementWithCallback = function (el, cb) {
    if (cb) {
        cb(el);
    }
};
var XmlElement = /** @class */ (function (_super) {
    __extends(XmlElement, _super);
    function XmlElement(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.children = [];
        return _this;
    }
    XmlElement.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    XmlElement.prototype.setAttributes = function (attributes) {
        this.attributes = attributes;
        return this;
    };
    /**
     * Creates a new element with the given name and attributes and then sets it's text content (can be a matcher)
     * @param name Element name
     * @param attributes Map of element attributes
     * @param arg Callback to configure the new element, or text content to create the new element with (can be a matcher)
     */
    XmlElement.prototype.appendElement = function (name, attributes, arg) {
        var el = new XmlElement(name).setAttributes(attributes);
        if (arg) {
            if (typeof arg !== 'function') {
                el.appendText(arg);
            }
            else {
                modifyElementWithCallback(el, arg);
            }
        }
        this.children.push(el);
        return this;
    };
    XmlElement.prototype.appendText = function (content) {
        if (typeof content === 'object' && content['pact:matcher:type']) {
            this.children.push(new xmlText_1.XmlText(content.value || '', content));
        }
        else {
            this.children.push(new xmlText_1.XmlText(content.toString()));
        }
        return this;
    };
    XmlElement.prototype.eachLike = function (name, attributes, cb, options) {
        if (options === void 0) { options = { examples: 1 }; }
        var el = new XmlElement(name).setAttributes(attributes);
        modifyElementWithCallback(el, cb);
        this.children.push({
            'pact:matcher:type': 'type',
            value: el,
            examples: options.examples,
        });
        return this;
    };
    return XmlElement;
}(xmlNode_1.XmlNode));
exports.XmlElement = XmlElement;
//# sourceMappingURL=xmlElement.js.map