import { Construct } from '@aws-cdk/core';
import { CfnPolicyProps } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import {CfnApiKeyProps, CfnGraphQLApiProps, CfnGraphQLSchemaProps, CfnDataSourceProps, CfnResolverProps, CfnGraphQLApi, CfnGraphQLSchema} from '@aws-cdk/aws-appsync'
import {CfnTableProps, CfnTable} from'@aws-cdk/aws-dynamodb'
import { CfnStack} from '@aws-cdk/aws-cloudformation';

export interface AmplifyAPIResourceProps {
    appSyncService?: ApiServiceResourceProps;
    DDbTables: Array<DynamoDBServiceResourceProps>;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type writeableCfnGraphQLApiProps = Writeable<CfnGraphQLApiProps>;
type writeableCfnApiKeyProps = Writeable<CfnApiKeyProps>;
type writeableCfnGraphQLSchemaProps = Writeable<CfnGraphQLSchemaProps>;
type writeableCfnPolicyProps = Writeable<CfnPolicyProps>;
type writeableCfnTableProps = Writeable<CfnTableProps>;
type writeableCfnDataSourceProps = Writeable<CfnDataSourceProps>;
type writeableCfnResolverProps = Writeable<CfnResolverProps>;




interface ApiServiceResourceProps {
    GraphQLAPI?: writeableCfnGraphQLApiProps;
    // GraphQLAPIKey?: writeableCfnApiKeyProps;
    // GraphQLSchema?: writeableCfnGraphQLSchemaProps;
    // DDbStacks?: Array<CfnStackProps>;
}

interface DynamoDBServiceResourceProps {
    // logicalId: string;
    table: writeableCfnTableProps;
    // tableIamRole: writeableCfnPolicyProps;
    // tableDatasource: writeableCfnDataSourceProps;
}

export class amplifyApiServiceResource extends Construct {
    apiCfnString: string;
    ddbCfnString: string[] = [];
    constructor(scope: cdk.Construct, id: string,Props?: AmplifyAPIResourceProps) {
        super(scope, id);
        // generate graphqlApi
        const apiResourceStack = new apiServiceResourceStack(this, 'root-stack', Props.appSyncService);
        this.apiCfnString = apiResourceStack.cfnString;
        Props.DDbTables.forEach(ddbTableProps => {
            const ddbResourceStack = new ddbServiceResourceStack(apiResourceStack, 'random-tablestack',ddbTableProps);
            this.ddbCfnString.push(ddbResourceStack.cfnString);
        })

    }
}

export class apiServiceResourceStack extends cdk.Stack {
    cfnString: string;
    constructor(scope: cdk.Construct, id: string,Props?: ApiServiceResourceProps) {
        super(scope, id);
        // generate graphqlApi
        const graphqlApi = new CfnGraphQLApi(this, 'GraphQLAPI', Props.GraphQLAPI);
        const graphQLSchema = new CfnGraphQLSchema(this,"GraphQLSchema",{apiId : cdk.Fn.getAtt('GraphQLAPI',"apiid").toString()} )
        const tablestack = new CfnStack(this,'randomTable', {templateUrl: "randompath"});
        tablestack.addDependsOn(graphQLSchema);
        this.cfnString = this._toCloudFormation();
    }
}

export class ddbServiceResourceStack extends cdk.Stack {
    cfnString: string;
    constructor(scope: cdk.Construct, id: string,Props?: DynamoDBServiceResourceProps) {
        super(scope, id);
        // generate Table
            const ddbTable = new CfnTable(this,'randomTable',Props.table);
            this.cfnString = this._toCloudFormation();
    }
}
