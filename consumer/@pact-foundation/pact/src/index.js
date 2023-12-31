"use strict";
/**
 * Pact module meta package.
 * @module Pact
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerWithMetadata = exports.MessageProviderPact = exports.Pact = exports.Matchers = void 0;
/**
 * Exposes {@link Pact}
 * @memberof Pact
 * @static
 */
/**
 * Exposes {@link Matchers}
 * To avoid polluting the root module's namespace, re-export
 * Matchers as its own module
 * @memberof Pact
 * @static
 */
var MatchersStar = __importStar(require("./dsl/matchers"));
exports.Matchers = MatchersStar;
var httpPact_1 = require("./httpPact");
Object.defineProperty(exports, "Pact", { enumerable: true, get: function () { return httpPact_1.Pact; } });
/**
 * Exposes {@link MessageConsumerPact}
 * @memberof Pact
 * @static
 */
__exportStar(require("./messageConsumerPact"), exports);
/**
 * Exposes {@link MessageProviderPact}
 * @memberof Pact
 * @static
 */
var messageProviderPact_1 = require("./messageProviderPact");
Object.defineProperty(exports, "MessageProviderPact", { enumerable: true, get: function () { return messageProviderPact_1.MessageProviderPact; } });
Object.defineProperty(exports, "providerWithMetadata", { enumerable: true, get: function () { return messageProviderPact_1.providerWithMetadata; } });
/**
 * Exposes {@link Message}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/message"), exports);
/**
 * Exposes {@link Verifier}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/verifier/verifier"), exports);
/**
 * Exposes {@link GraphQL}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/graphql"), exports);
/**
 * Exposes {@link ApolloGraphQL}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/apolloGraphql"), exports);
/**
 * Exposes {@link Interaction}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/interaction"), exports);
/**
 * Exposes {@link MockService}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/mockService"), exports);
__exportStar(require("./v3"), exports);
/**
 * Exposes {@link PactOptions}
 * @memberof Pact
 * @static
 */
__exportStar(require("./dsl/options"), exports);
//# sourceMappingURL=index.js.map