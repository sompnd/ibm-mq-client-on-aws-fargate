# build stage to compile sources and assemble fat jar
FROM maven:3.5.3-jdk-8-alpine as build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ /build/src/
RUN mvn package


# declare runtime stage
FROM openjdk:8-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=build /build/target/*.jar app.jar
ENTRYPOINT exec java \
    -Dspring.profiles.active=${STAGE} \
    -jar /app.jar 