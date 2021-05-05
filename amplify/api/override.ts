import { AmplifyAPIResourceProps } from '../../src/types/api'; // @aws-amplify/cli


export function overrideApiProps(props: AmplifyAPIResourceProps ):void {
    //enable xray for api
    props.appSyncService.GraphQLAPI.xrayEnabled = true;
    // change billing mode for @model table
    props.DDbTables.forEach(table =>{
        table.table.billingMode = "PROVISIONED"
    })
}