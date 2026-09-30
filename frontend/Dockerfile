# Stage 1: Build the Vite app
FROM node:22-alpine AS builder
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
