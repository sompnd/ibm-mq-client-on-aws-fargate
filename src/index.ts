#!/usr/bin/env node
import 'source-map-support/register';
import { App, Environment, Tags } from '@aws-cdk/core';
import { ComputeStack } from './compute-stack';

const config: any = {
  preprod: {
    vpcId: 'vpc-PREPROD'
  },
  prod: {
    vpcId: 'vpc-PROD'
  }
};

const app = new App();

const stage: string = app.node.tryGetContext('stage');
if (stage === undefined || !['preprod', 'prod'].includes(stage)) {
  throw new Error("'stage' context must be provided with value either 'preprod' or 'prod'");
}

Tags.of(app).add('project', 'example');
Tags.of(app).add('stage', stage);

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

new ComputeStack(app, 'Compute', {
  env,
  stackName: `Compute-${stage}`,
  description: `Compute resources on ${stage}`,
  stage,
  vpcId: config[stage].vpcId
});
