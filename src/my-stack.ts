import * as cdk from '@aws-cdk/core';
import * as cfninc from '@aws-cdk/cloudformation-include';
import {overrideProps1} from '../amplify/storage/s3resource/override'
import {AmplifyStorageResourceProps} from './types/storage'

export class MyStack extends cdk.Stack {
  cfnstring: string;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const cfntemplateFile = '/Users/akz/workspace/projects/cdkoverride/amplifycdkoverride/amplify/storage/s3resource/build1/cloud.json';
    const template = new cfninc.CfnInclude(this, 'Template', { 
      templateFile: cfntemplateFile,
    });
    // get override Props from user
    const amplifyOverRideProps = overrideProps1();
    if(amplifyOverRideProps.S3Service){
      const serviceProps = amplifyOverRideProps.S3Service;
      const bucket = template.getResource('S3Bucket');
      bucket.addPropertyOverride('objectLockEnabled',true);
      //change iam policy
      const s3PublicPolicy = template.getResource('S3AuthPublicPolicy');
      s3PublicPolicy.addPropertyOverride('PolicyName','modified_policy');
    }
    this.cfnstring = this._toCloudFormation();
  }
}