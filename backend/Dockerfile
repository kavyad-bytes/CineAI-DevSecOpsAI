FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY target/*.jar app.jar

# change ownership
RUN chown -R appuser:appgroup /app

# switch to non-root
USER appuser

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]