FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy compiled app
COPY dist ./dist
COPY src/client ./src/client

# Expose port
EXPOSE 3000

# Serve static files and run server
CMD ["node", "dist/server/index.js"]
