"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideApiProps = void 0;
function overrideApiProps(props) {
    //enable xray for api
    props.appSyncService.GraphQLAPI.xrayEnabled = true;
    // change billing mode for @model table
    props.DDbTables.forEach(table => {
        table.table.billingMode = "PROVISIONED";
    });
}
exports.overrideApiProps = overrideApiProps;
