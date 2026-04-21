# Use an official JDK runtime
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy everything from the current directory (which will be 'backend')
COPY . .

# Fix permissions
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean install -DskipTests

# Run the jar file
ENTRYPOINT ["java", "-jar", "target/empFind-0.0.1-SNAPSHOT.jar"]
