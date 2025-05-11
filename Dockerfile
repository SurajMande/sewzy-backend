# Use a Node.js base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your backend listens on (e.g., 5000)
EXPOSE 5000

# Set the default command to start the backend
CMD ["node", "app.js"]

