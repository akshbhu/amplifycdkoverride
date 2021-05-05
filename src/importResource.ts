import * as cdk from '@aws-cdk/core';
import { MyStack } from './my-stack';
import * as fs from 'fs-extra';
import * as path from 'path';

const resourceDir = path.join(process.cwd(), `amplify/storage/s3resource`);
const app = new cdk.App();
const mystack = new MyStack(app, 'MyStack');
fs.writeFileSync(path.join(resourceDir, 'build/cloudformation1.json'),    JSON.stringify(mystack.cfnstring,null,4));


