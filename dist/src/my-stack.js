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
exports.MyStack = void 0;
const cdk = __importStar(require("@aws-cdk/core"));
const cfninc = __importStar(require("@aws-cdk/cloudformation-include"));
const override_1 = require("../amplify/storage/s3resource/override");
class MyStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const cfntemplateFile = '/Users/akz/workspace/projects/cdkoverride/amplifycdkoverride/amplify/storage/s3resource/build1/cloud.json';
        const template = new cfninc.CfnInclude(this, 'Template', {
            templateFile: cfntemplateFile,
        });
        // get override Props from user
        const amplifyOverRideProps = override_1.overrideProps1();
        if (amplifyOverRideProps.S3Service) {
            const serviceProps = amplifyOverRideProps.S3Service;
            const bucket = template.getResource('S3Bucket');
            bucket.addPropertyOverride('objectLockEnabled', true);
            //change iam policy
            const s3PublicPolicy = template.getResource('S3AuthPublicPolicy');
            s3PublicPolicy.addPropertyOverride('PolicyName', 'modified_policy');
        }
        this.cfnstring = this._toCloudFormation();
    }
}
exports.MyStack = MyStack;
