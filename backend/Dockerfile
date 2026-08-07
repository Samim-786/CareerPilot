# ---------- Builder Stage ----------
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy Maven wrapper and project configuration
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Make Maven wrapper executable
RUN chmod +x mvnw

# Use a BuildKit cache mount so Maven's local repo persists across builds
RUN --mount=type=cache,target=/root/.m2 ./mvnw dependency:go-offline -B

# Copy application source
COPY src ./src

# Build the application
RUN --mount=type=cache,target=/root/.m2 ./mvnw clean package -DskipTests


# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Document the application port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]