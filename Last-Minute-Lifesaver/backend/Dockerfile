# Use official Node.js 20 base image for production-ready compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for dependency install
COPY package.json package-lock.json ./

# Install dependencies only
RUN npm ci --production

# Copy backend source code into container
COPY . ./

# Ensure app listens on the Cloud Run port and all interfaces
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["node", "src/server.js"]
