# 1) Compila el frontend
FROM node:20-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# 2) Compila el backend e incluye el frontend como archivos estáticos
FROM maven:3.9-eclipse-temurin-17 AS api
WORKDIR /app
COPY backend/pom.xml .
RUN mvn -q dependency:go-offline
COPY backend/src ./src
COPY --from=web /web/dist ./src/main/resources/static
RUN mvn -q package -DskipTests

# 3) Imagen final: un solo servicio que sirve web + API
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=api /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
