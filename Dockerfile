# Use Node.js 20 as the parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Set the command to start the node server
CMD serve -s build

# Tell Docker about the port the app runs on
EXPOSE 5000