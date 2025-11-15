FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/the-physc-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
