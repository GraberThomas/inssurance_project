# → build de ton app React
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .

ARG VITE_API_MODEL_URL
ARG VITE_MODEL_ROUTE
ARG VITE_MODEL_PREDICT_SUBROUTE
ARG VITE_API_PERSISTANCE_URL

RUN echo "VITE_API_MODEL_URL=$VITE_API_MODEL_URL" > .env && \
    echo "VITE_MODEL_ROUTE=$VITE_MODEL_ROUTE" >> .env && \
    echo "VITE_MODEL_PREDICT_SUBROUTE=$VITE_MODEL_PREDICT_SUBROUTE" >> .env && \
    echo "VITE_API_PERSISTANCE_URL=$VITE_API_PERSISTANCE_URL" >> .env

RUN npm install
RUN npm run build

FROM caddy:alpine

COPY --from=builder /app/dist /usr/share/caddy

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
