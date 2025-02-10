# Use official Node.js image
FROM node:14

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Start the app
CMD ["node", "server.js"]