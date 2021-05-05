import { S3ServiceResourceStack, AmplifyStorageResourceProps } from '../../../src/types/storage'; // @aws-amplify/cli
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

export function overrideProps(props: AmplifyStorageResourceProps ):void {

    if(!props?.S3Service?.S3Bucket)  {
        throw new Error("Missing resource")
    }

    //props.S3Service.S3Bucket.bucketName = "DONE";

    props.S3Service.S3Bucket.bucketName = "nikhilsbucket";
    props.S3Service.S3Bucket.objectLockEnabled= true;
    props.S3Service.S3AuthPublicPolicy.policyName = "my_custom_name2";
    
    // props.S3Service.S3AuthPublicPolicy.policyName = "my_custom_name";

}

export function overrideProps1():AmplifyStorageResourceProps {
    let props: AmplifyStorageResourceProps = {};
    //props.S3Service.S3Bucket.bucketName = "DONE";
    props.S3Service.S3Bucket.bucketName = "nikhilsbucket";
    props.S3Service.S3Bucket.objectLockEnabled= true;
    props.S3Service.S3AuthPublicPolicy.policyName = "my_custom_name2";
    return props;
}

export function overrideStack(stack: S3ServiceResourceStack):void {

    new s3.CfnBucket(stack, "MySecondBucket", {
        bucketName: "MySecondBucket"
    });
     

    // console.log(stack.toString());
    
}

export class S3ServiceResourceStackOverride extends cdk.Stack {

    cfnstring: string;
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        new s3.CfnBucket(this, "SecondBucket", {
            bucketName: "SecondBucket"
        });

        this.cfnstring = this._toCloudFormation();
    }

}