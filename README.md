# ibm-mq-client-on-aws-fargate

Java spring boot client for IBM MQ running on AWS Fargate container

### [Changelog](../main/CHANGELOG.md)

## Containers

- MQ Client - [README.md](containers/mqclient/README.md)

## Deploy

`<STAGE>` denotes environment e.g test, prod

- `npx cdk bootstrap aws://<AWS_ACCOUNT_ID>/<AWS_REGION> -c stage=<STAGE>` boostrap to aws env
- `npx cdk deploy --all -c stage=<STAGE>` deploy everything

## Workflow (build & deploy)

- Make changes, commit, PR
- Run `git checkout main`
- Run `git pull --tags`
- Run `npm version [patch|minor|major]`
- Run `git push --follow-tags`
- Deploy
