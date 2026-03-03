# Use Node.js 22 as base image
FROM node:22

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else (including app.js at project root)
COPY . .

# Expose port used by the app
EXPOSE 5000

# Start using npm dev script
CMD node app.js
