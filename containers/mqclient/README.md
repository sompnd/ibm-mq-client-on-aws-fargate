# mqclient

Ingests data from mq and processes

> https://github.com/ibm-messaging/mq-jms-spring

### Run a local mq server for development

```
docker run --env LICENSE=accept --env MQ_QMGR_NAME=QM1 \
           --publish 1414:1414 \
           --publish 9443:9443 \
           --detach \
           ibmcom/mq
```

- mq console: https://localhost:9443/ibmmq/console/login.html
- Admin creds: admin/passw0rd
- Reference: https://github.com/ibm-messaging/mq-container/blob/master/docs/developer-config.md

### Workspace

- `JAVA_HOME=/path/to/jdk8`
- `mvn clean package`
- `mvn spring-boot:run`

### Run with docker in local with 'preprod' profile

- `docker build -t mqclient:latest .`
- Run:
  ```
  docker run -e STAGE=preprod \
              -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
              -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
              -e AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN} \
              mqclient:latest
  ```

## Deployment

> Code compile, image build, image push, deploy to AWS - Done with main stack deployment
