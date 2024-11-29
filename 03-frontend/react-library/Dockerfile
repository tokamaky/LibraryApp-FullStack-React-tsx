# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
# Dockerfile for frontend
COPY ./ssl-localhost/localhost.crt /app/ssl-localhost/localhost.crt
COPY ./ssl-localhost/localhost.key /app/ssl-localhost/localhost.key
COPY . .

# Expose the default React port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
