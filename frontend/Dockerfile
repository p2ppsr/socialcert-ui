# Stage 1: Build the Vite app
FROM node:22.23.4-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS builder
RUN test "$(node --version)" = "v22.23.4"
ARG SOURCE_COMMIT=development
ENV SOURCE_COMMIT=${SOURCE_COMMIT}
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN node -e "require('fs').writeFileSync('/app/build/release.json',JSON.stringify({sourceCommit:process.env.SOURCE_COMMIT,version:require('./package.json').version}))"

# Stage 2: Serve with Nginx
FROM nginx:latest
ARG SOURCE_COMMIT=development
LABEL org.opencontainers.image.revision=${SOURCE_COMMIT}
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
