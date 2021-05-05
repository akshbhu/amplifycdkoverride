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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileApi = exports.addApi = void 0;
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const cdk = __importStar(require("@aws-cdk/core"));
const api_1 = require("./types/api");
const override_1 = require("../amplify/api/override");
const resourceDir = path_1.default.join(process.cwd(), `amplify/storage/apiresource`);
const cliInputs = addApi();
compileApi(cliInputs);
function addApi() {
    // Create amplify directory
    fs.ensureDirSync(resourceDir);
    // create cli-inputs.json - mock it for now but inputs from CLI I/O
    const apiName = process.argv[2] || "testapi";
    const graphqlSchemaPath = process.argv[3] || "/Users/akz/workspace/projects/cdkoverride/amplifycdkoverride/amplify/api/apiresource/schema.graphql";
    const inputs = { apiName, graphqlSchemaPath };
    fs.writeFileSync(path_1.default.join(resourceDir, 'cli-inputs.json'), JSON.stringify(inputs, null, 4));
    return inputs;
}
exports.addApi = addApi;
function compileApi(cliInputs) {
    // Validate cli-inputs.json
    // Form AmplifyStorageResource object from cli-inputs.json
    const schemaPath = cliInputs.graphqlSchemaPath;
    // parse graphql schema to parse directive using schema Path
    const amplifyApiResource = {
        appSyncService: {
            GraphQLAPI: {
                name: cliInputs.apiName,
                authenticationType: "AMAZON_COGNITO_USER_POOLS",
            },
        },
        DDbTables: [
            {
                table: {
                    // input will come after parsing graphql schema
                    keySchema: [
                        {
                            attributeName: "id",
                            keyType: "HASH"
                        }
                    ],
                    tableName: "randomTable"
                }
            }
        ],
    };
    override_1.overrideApiProps(amplifyApiResource);
    fs.ensureDirSync(path_1.default.join(resourceDir, 'build', 'stacks'));
    // generate parameters.json from AmplifyStorageResource object
    fs.writeFileSync(path_1.default.join(resourceDir, 'build/parameters.json'), JSON.stringify({}, null, 4));
    // generate cloudformaion-template.json &  from AmplifyStorageResource object
    const app = new cdk.App();
    const resourceStack = new api_1.amplifyApiServiceResource(app, "apiResource", amplifyApiResource);
    //app.synth();
    // save api deployment project (resolver ,stacks , Appsync functions)
    fs.writeFileSync(path_1.default.join(resourceDir, 'build/cloudformation.json'), JSON.stringify(resourceStack.apiCfnString, null, 4));
    resourceStack.ddbCfnString.forEach(cfn => {
        fs.writeFileSync(path_1.default.join(resourceDir, 'build/stacks/randomTable.json'), JSON.stringify(cfn, null, 4));
    });
}
exports.compileApi = compileApi;
