# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Prisma client (optional but recommended)
RUN npx prisma generate

# Reset DB and seed in build stage (usually used only for dev/test containers)
# COMMENT OUT for production builds
# RUN npx prisma migrate reset --force && npm run seed

# Default command: migrate deploy + seed + run app
CMD npx prisma migrate deploy && npm run seed && node src/app.js