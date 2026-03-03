# # Build Stage
# FROM node:22-alpine AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .

# # Only run build, 'output: export' will generate /out automatically
# RUN npm run build

# # Serve Stage
# FROM nginx:alpine
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=builder /app/out /usr/share/nginx/html
# CMD ["nginx", "-g", "daemon off;"]


# Build Stage
FROM node:22-alpine AS builder
 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
 
# Production Stage
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
# EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
 
