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
const cdk = __importStar(require("@aws-cdk/core"));
const my_stack_1 = require("./my-stack");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const resourceDir = path.join(process.cwd(), `amplify/storage/s3resource`);
const app = new cdk.App();
const mystack = new my_stack_1.MyStack(app, 'MyStack');
fs.writeFileSync(path.join(resourceDir, 'build/cloudformation1.json'), JSON.stringify(mystack.cfnstring, null, 4));
