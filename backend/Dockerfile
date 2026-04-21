# Use an official JDK runtime
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the backend folder contents
COPY backend/ .

# Fix permissions for the Maven wrapper
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean install -DskipTests

# Run the jar file
ENTRYPOINT ["java", "-jar", "target/empFind-0.0.1-SNAPSHOT.jar"]
