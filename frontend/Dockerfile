# ===================================================================
# Estagio 1: Build da aplicacao React + TypeScript com Vite
# ===================================================================
FROM node:20-bookworm-slim AS build

WORKDIR /app

# Copia manifestos primeiro para aproveitar o cache de camadas do npm
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do codigo-fonte do frontend
COPY . .

# Variaveis de build do Vite (podem ser sobrescritas via build-args)
ARG VITE_API_URL=http://localhost:8080
ARG VITE_GOOGLE_CLIENT_ID=""
ARG VITE_PUSHER_KEY=""
ARG VITE_PUSHER_CLUSTER=sa1

ENV VITE_API_URL=$VITE_API_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_PUSHER_KEY=$VITE_PUSHER_KEY \
    VITE_PUSHER_CLUSTER=$VITE_PUSHER_CLUSTER

RUN npm run build

# ===================================================================
# Estagio 2: Servidor estatico leve com Nginx (suporte a rotas SPA)
# ===================================================================
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

