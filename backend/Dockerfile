# ===================================================================
# Estagio 1: Build da aplicacao com Maven e Java 17
# ===================================================================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copia apenas o pom.xml primeiro para aproveitar o cache de camadas do Docker
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copia o codigo-fonte e empacota o .jar executavel
COPY src ./src
RUN mvn -B clean package -DskipTests

# ===================================================================
# Estagio 2: Runtime enxuto, seguro (non-root) e otimizado para nuvem
# ===================================================================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Cria usuario sem privilegios de root e garante permissao na pasta de uploads
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --no-create-home appuser && \
    mkdir -p /app/uploads && \
    chown -R appuser:appgroup /app

COPY --chown=appuser:appgroup --from=build /app/target/*.jar app.jar

USER appuser

# Ajusta limites de memoria da JVM para respeitar containers (ex: 512MB no Render)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
