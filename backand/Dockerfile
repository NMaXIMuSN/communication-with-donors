# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install
# Copy the rest of the application files
COPY . .

RUN npm run generate
RUN npm run generate:donor
# Build the NestJS application
RUN npm run build
RUN npm run postbuild
# RUN npm run migrate
# RUN npm run migrate:donor

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]