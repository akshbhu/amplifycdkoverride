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
exports.S3ServiceResourceStackOverride = exports.overrideStack = exports.overrideProps1 = exports.overrideProps = void 0;
const s3 = __importStar(require("@aws-cdk/aws-s3"));
const cdk = __importStar(require("@aws-cdk/core"));
function overrideProps(props) {
    var _a;
    if (!((_a = props === null || props === void 0 ? void 0 : props.S3Service) === null || _a === void 0 ? void 0 : _a.S3Bucket)) {
        throw new Error("Missing resource");
    }
    //props.S3Service.S3Bucket.bucketName = "DONE";
    props.S3Service.S3Bucket.bucketName = "nikhilsbucket";
    props.S3Service.S3Bucket.objectLockEnabled = true;
    props.S3Service.S3AuthPublicPolicy.policyName = "my_custom_name2";
    // props.S3Service.S3AuthPublicPolicy.policyName = "my_custom_name";
}
exports.overrideProps = overrideProps;
function overrideProps1() {
    let props = {};
    //props.S3Service.S3Bucket.bucketName = "DONE";
    props.S3Service.S3Bucket.bucketName = "nikhilsbucket";
    props.S3Service.S3Bucket.objectLockEnabled = true;
    props.S3Service.S3AuthPublicPolicy.policyName = "my_custom_name2";
    return props;
}
exports.overrideProps1 = overrideProps1;
function overrideStack(stack) {
    new s3.CfnBucket(stack, "MySecondBucket", {
        bucketName: "MySecondBucket"
    });
    // console.log(stack.toString());
}
exports.overrideStack = overrideStack;
class S3ServiceResourceStackOverride extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        new s3.CfnBucket(this, "SecondBucket", {
            bucketName: "SecondBucket"
        });
        this.cfnstring = this._toCloudFormation();
    }
}
exports.S3ServiceResourceStackOverride = S3ServiceResourceStackOverride;
