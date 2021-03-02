import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as logs from '@aws-cdk/aws-logs';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
// import * as appAutoscaling from '@aws-cdk/aws-applicationautoscaling';

interface ComputeStackProps extends cdk.StackProps {
  readonly stage: string;
  readonly vpcId: string;
}

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);
    const { stage, vpcId } = props;

    // Refer existing vpc
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId });

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      clusterName: `${id}-Cluster-${stage}`
    });

    // TODO iterate over all container definitions available in ./containers and create task defs & services dynamically
    // Task definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    taskDefinition.addContainer('mqclient', {
      image: ecs.ContainerImage.fromDockerImageAsset(
        new DockerImageAsset(this, 'mqclient', {
          directory: path.join(__dirname, '../containers/mqclient')
        })
      ),
      environment: { STAGE: stage },
      logging: new ecs.AwsLogDriver({
        streamPrefix: `${id}-${stage}`,
        logRetention: logs.RetentionDays.ONE_MONTH,
        datetimeFormat: '%Y-%m-%d %H:%M:%S'
      })
    });

    // ecs fargate service
    const service = new ecs.FargateService(this, 'mqclient', {
      cluster,
      taskDefinition
    });

    // Autoscaling
    const autoScalingGroup = service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 4
    });

    // Scaling By Schedule
    // autoScalingGroup.scaleOnSchedule('ScaleUpBeforeMidnight', {
    //   schedule: appAutoscaling.Schedule.cron({ hour: '23', minute: '00' }), // UTC
    //   minCapacity: 3,
    // });
    // autoScalingGroup.scaleOnSchedule('ScaleDownAtMorning', {
    //   schedule: appAutoscaling.Schedule.cron({ hour: '07', minute: '00' }), // UTC
    //   maxCapacity: 2,
    // });

    // Scaling By CPU Usage
    autoScalingGroup.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });

    // Outputs
    new cdk.CfnOutput(this, 'clusterArn', {
      value: cluster.clusterArn
    });
  }
}
