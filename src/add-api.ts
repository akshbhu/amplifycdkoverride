import * as fs from 'fs-extra';
import path from 'path';
import * as cdk from '@aws-cdk/core';
import {AmplifyAPIResourceProps, amplifyApiServiceResource, apiServiceResourceStack} from './types/api';
import {overrideApiProps} from  '../amplify/api/override'


const resourceDir = path.join(process.cwd(), `amplify/storage/apiresource`);

const cliInputs = addApi();
compileApi(cliInputs);

export function addApi() {
  // Create amplify directory
  fs.ensureDirSync(resourceDir);

  // create cli-inputs.json - mock it for now but inputs from CLI I/O

  const apiName = process.argv[2] || "testapi";

  const graphqlSchemaPath = process.argv[3] || "/Users/akz/workspace/projects/cdkoverride/amplifycdkoverride/amplify/api/apiresource/schema.graphql";


  const inputs = { apiName , graphqlSchemaPath };

  fs.writeFileSync(path.join(resourceDir, 'cli-inputs.json'), JSON.stringify(inputs, null, 4));

  return inputs;
}

export function compileApi(cliInputs: any) {


  // Validate cli-inputs.json

  // Form AmplifyStorageResource object from cli-inputs.json

  const schemaPath = cliInputs.graphqlSchemaPath;

  // parse graphql schema to parse directive using schema Path

  const amplifyApiResource: AmplifyAPIResourceProps = {
    appSyncService : {
      GraphQLAPI: {
        name: cliInputs.apiName,
        authenticationType: "AMAZON_COGNITO_USER_POOLS",
      },
    },
    DDbTables: [
      {
        table:{
          // input will come after parsing graphql schema
          keySchema: [
            {
              attributeName: "id",
              keyType: "HASH"
            }
          ],
          tableName: "randomTable" 
      }
    }],
  };

  overrideApiProps(amplifyApiResource);

  fs.ensureDirSync(path.join(resourceDir, 'build', 'stacks'));

  
  // generate parameters.json from AmplifyStorageResource object

  fs.writeFileSync(path.join(resourceDir, 'build/parameters.json'), JSON.stringify({}, null, 4));


  // generate cloudformaion-template.json &  from AmplifyStorageResource object
  const app = new cdk.App();
  const resourceStack = new amplifyApiServiceResource(app, "apiResource", amplifyApiResource);
  //app.synth();

  // save api deployment project (resolver ,stacks , Appsync functions)
  fs.writeFileSync(path.join(resourceDir, 'build/cloudformation.json'), JSON.stringify(resourceStack.apiCfnString, null, 4));
  resourceStack.ddbCfnString.forEach(cfn => {
    fs.writeFileSync(path.join(resourceDir, 'build/stacks/randomTable.json'), JSON.stringify(cfn, null, 4));
  })
}
