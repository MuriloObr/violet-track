# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go build -o /app/api ./cmd/api/main.go

# Stage 3: Final Runtime
FROM alpine:latest
WORKDIR /app
COPY --from=backend-builder /app/api ./api
COPY --from=frontend-builder /app/frontend/dist ./web/dist

EXPOSE 3000
CMD ["./api"]
