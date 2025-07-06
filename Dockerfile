# Use Node.js base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn

# Copy the entire project files into the container
COPY . .

# Build the project
RUN yarn run build

# Expose the required port
EXPOSE 3000

# Run the application
CMD ["yarn", "run", "start:prod"]
