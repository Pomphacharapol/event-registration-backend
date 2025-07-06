# 📕 Basic Application Deployment

## 1. Docker ignore

### .dockerignore

```docker
.husky
.vscode
development
dist
environments # Add environment manually to server for production '.env.prod'
node_modules
```

## 2. Deploy Application with Docker file

### Dockerfile

```docker
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
```

## 3. Build Application

### Build and Start the Application

```bash
# Build image
docker build -t boilerplate-nest-app .
# Run application with docker container
docker run -p 3000:3000 boilerplate-nest-app
```
