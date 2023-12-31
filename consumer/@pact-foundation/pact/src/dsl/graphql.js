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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLInteraction = void 0;
/**
 * Pact GraphQL module.
 *
 * @module GraphQL
 */
var lodash_1 = require("lodash");
var graphql_tag_1 = __importDefault(require("graphql-tag"));
var interaction_1 = require("./interaction");
var matchers_1 = require("./matchers");
var graphQLQueryError_1 = __importDefault(require("../errors/graphQLQueryError"));
var configurationError_1 = __importDefault(require("../errors/configurationError"));
var escapeSpace = function (s) { return s.replace(/\s+/g, '\\s*'); };
var escapeRegexChars = function (s) {
    // eslint-disable-next-line no-useless-escape
    return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};
var escapeGraphQlQuery = function (s) { return escapeSpace(escapeRegexChars(s)); };
/**
 * GraphQL interface
 */
var GraphQLInteraction = /** @class */ (function (_super) {
    __extends(GraphQLInteraction, _super);
    function GraphQLInteraction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.operation = undefined;
        _this.variables = undefined;
        return _this;
    }
    /**
     * The type of GraphQL operation. Generally not required.
     */
    GraphQLInteraction.prototype.withOperation = function (operation) {
        this.operation = operation;
        return this;
    };
    /**
     * Any variables used in the Query
     */
    GraphQLInteraction.prototype.withVariables = function (variables) {
        this.variables = variables;
        return this;
    };
    /**
     * The actual GraphQL query as a string.
     *
     * NOTE: spaces are not important, Pact will auto-generate a space-insensitive matcher
     *
     *  e.g. the value for the "query" field in the GraphQL HTTP payload:
     *  '{ "query": "{
     *        Category(id:7) {
     *          id,
     *          name,
     *          subcategories {
     *            id,
     *            name
     *          }
     *        }
     *     }"
     *  }'
     */
    GraphQLInteraction.prototype.withQuery = function (query) {
        return this.queryOrMutation(query, 'query');
    };
    /**
     * The actual GraphQL mutation as a string.
     *
     * NOTE: spaces are not important, Pact will auto-generate a space-insensitive matcher
     *
     * e.g. the value for the "query" field in the GraphQL HTTP payload:
     *
     * mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
     *   createReview(episode: $ep, review: $review) {
     *     stars
     *     commentary
     *   }
     * }
     */
    GraphQLInteraction.prototype.withMutation = function (mutation) {
        return this.queryOrMutation(mutation, 'mutation');
    };
    /**
     * Returns the interaction object created.
     */
    GraphQLInteraction.prototype.json = function () {
        _super.prototype.json.call(this);
        if ((0, lodash_1.isNil)(this.query)) {
            throw new configurationError_1.default('You must provide a GraphQL query.');
        }
        if ((0, lodash_1.isNil)(this.state.description)) {
            throw new graphQLQueryError_1.default('You must provide a description for the query.');
        }
        this.state.request = (0, lodash_1.extend)({
            body: (0, lodash_1.omitBy)({
                operationName: this.operation,
                query: (0, matchers_1.regex)({
                    generate: this.query,
                    matcher: escapeGraphQlQuery(this.query),
                }),
                variables: this.variables,
            }, lodash_1.isUndefined),
            headers: { 'content-type': 'application/json' },
            method: 'POST',
        }, this.state.request);
        return this.state;
    };
    GraphQLInteraction.prototype.queryOrMutation = function (query, type) {
        if ((0, lodash_1.isNil)(query)) {
            throw new configurationError_1.default("You must provide a GraphQL ".concat(type, "."));
        }
        try {
            (0, graphql_tag_1.default)(query);
        }
        catch (e) {
            throw new graphQLQueryError_1.default("GraphQL ".concat(type, " is invalid: ").concat(e.message));
        }
        this.query = query;
        return this;
    };
    return GraphQLInteraction;
}(interaction_1.Interaction));
exports.GraphQLInteraction = GraphQLInteraction;
//# sourceMappingURL=graphql.js.map