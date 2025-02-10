# Use official Node.js image
FROM node:14

# Set working directory
WORKDIR /app

# Copy application files into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app will be running on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
