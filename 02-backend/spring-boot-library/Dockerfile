FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy all application files into the container
COPY . /app

# Install Maven and build the application inside the container
RUN apt-get update && apt-get install -y maven && mvn clean compile

# Expose the default Spring Boot port
EXPOSE 8443

# Run the Spring Boot application
CMD ["mvn", "spring-boot:run"]

