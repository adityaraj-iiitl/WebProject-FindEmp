# Use an official JDK runtime as a parent image
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and source code
COPY . .

# Build the application
RUN chmod +x mvnw
RUN ./mvnw clean install -DskipTests

# Run the jar file
ENTRYPOINT ["java", "-jar", "target/empFind-0.0.1-SNAPSHOT.jar"]
