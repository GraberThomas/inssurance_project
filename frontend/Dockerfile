FROM node:20-alpine AS builder
WORKDIR /app
COPY . .

ARG VITE_API_MODEL_URL
ARG VITE_MODEL_ROUTE
ARG VITE_MODEL_PREDICT_SUBROUTE

RUN echo "VITE_API_MODEL_URL=$VITE_API_MODEL_URL" > .env && \
    echo "VITE_MODEL_ROUTE=$VITE_MODEL_ROUTE" >> .env && \
    echo "VITE_MODEL_PREDICT_SUBROUTE=$VITE_MODEL_PREDICT_SUBROUTE" >> .env

RUN npm install
RUN npm run build


FROM caddy:alpine
COPY --from=builder /app/dist /usr/share/caddy
EXPOSE 80
CMD ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":80"]
