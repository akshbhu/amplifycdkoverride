"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ddbServiceResourceStack = exports.apiServiceResourceStack = exports.amplifyApiServiceResource = void 0;
const core_1 = require("@aws-cdk/core");
const cdk = __importStar(require("@aws-cdk/core"));
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const aws_cloudformation_1 = require("@aws-cdk/aws-cloudformation");
class amplifyApiServiceResource extends core_1.Construct {
    constructor(scope, id, Props) {
        super(scope, id);
        this.ddbCfnString = [];
        // generate graphqlApi
        const apiResourceStack = new apiServiceResourceStack(this, 'root-stack', Props.appSyncService);
        this.apiCfnString = apiResourceStack.cfnString;
        Props.DDbTables.forEach(ddbTableProps => {
            const ddbResourceStack = new ddbServiceResourceStack(apiResourceStack, 'random-tablestack', ddbTableProps);
            this.ddbCfnString.push(ddbResourceStack.cfnString);
        });
    }
}
exports.amplifyApiServiceResource = amplifyApiServiceResource;
class apiServiceResourceStack extends cdk.Stack {
    constructor(scope, id, Props) {
        super(scope, id);
        // generate graphqlApi
        const graphqlApi = new aws_appsync_1.CfnGraphQLApi(this, 'GraphQLAPI', Props.GraphQLAPI);
        const graphQLSchema = new aws_appsync_1.CfnGraphQLSchema(this, "GraphQLSchema", { apiId: cdk.Fn.getAtt('GraphQLAPI', "apiid").toString() });
        const tablestack = new aws_cloudformation_1.CfnStack(this, 'randomTable', { templateUrl: "randompath" });
        tablestack.addDependsOn(graphQLSchema);
        this.cfnString = this._toCloudFormation();
    }
}
exports.apiServiceResourceStack = apiServiceResourceStack;
class ddbServiceResourceStack extends cdk.Stack {
    constructor(scope, id, Props) {
        super(scope, id);
        // generate Table
        const ddbTable = new aws_dynamodb_1.CfnTable(this, 'randomTable', Props.table);
        this.cfnString = this._toCloudFormation();
    }
}
exports.ddbServiceResourceStack = ddbServiceResourceStack;
