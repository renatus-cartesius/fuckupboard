# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/build ./build

# Copy server file
COPY server.js ./

# Expose port
EXPOSE 80

# Start the server
CMD ["node", "server.js"] 