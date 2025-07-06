# 📕 Running the Application

## Please download Docker desktop before development.

👉 download:  [🐋 Docker Desktop](https://www.docker.com/products/docker-desktop/) <br>
👉 download vscode extension: NPM Run ( 🚀 faster run package.json )

### 1. Install yarn package

```bash
# Install yarn package
$ yarn
# Or
$ yarn install
```

### 2. Run and Create database with docker compose file

```bash
# Create database in docker local environment
$ yarn run db:local:create
# Create database in docker test environment
$ yarn run db:test:create
```

### 3. Run migrations

* Run migrations
  
```bash
# Run all migrations
$ yarn run migration:local:run  # For local environment 
$ yarn run migration:test:run   # For test environment
```

* Revert migrations
  
```bash
# Run revert migrations
$ yarn run migration:local:revert   # For local environment
$ yarn run migration:test:revert    # For test environment
```

* Create new migration file
  
```bash
# Create new migrations file
$ yarn run migration:local:create ./src/migrations/<$NameOfYourMigration>
```

### 4. Run application

```bash
# Run application with environment
$ yarn run start:local  # For local environment
$ yarn run start:dev    # For dev environment
```

### 5. Run test application
  
* Run unit testing for test function or method in service

```bash
# Run application with environment
$ yarn run test:unit
```

* Run e2e testing for test repository called to database

```bash
## Please start Docker desktop for test environment before run e2e testing.
# Run docker for test environment
$ yarn run db:local:stop    # Stop database in docker local environment
$ yarn run db:test:start    # Start database in docker test environment

# Run e2e testing for test environment
$ yarn run test:e2e
```

### 6. Run Husky (Git hook) for set rules action to repository
  
Husky is a tool that helps configure Git hooks to automatically enforce rules before or after certain Git actions, such as before commit, before push, or before merging. It can be used to check and control the quality of code, such as running tests, formatting code, or checking for errors before committing to a repository.

#### Examples of usage include:

* Pre-commit hook: Setting it up to run code formatting every time before a commit.
* Pre-push hook: Setting it up to run unit tests every time before a push.
Husky enhances team collaboration by ensuring that code committed or pushed to the repository is of high quality and adheres to predefined standards.

```bash
# Run install and prepare husky package
$ yarn run prepare:husky
```

* Change path directory for pre-commit

```sh
## path: <$my_project>/.husky/_/pre-commit

#!/usr/bin/env sh
. "$(dirname "$0")/husky.sh"

yarn install
yarn format
yarn run lint --fix
yarn run husky:test:unit
```

### Reference

* [🐶 husky](https://typicode.github.io/husky/get-started.html)
* [🐈‍⬛ swagger](https://classic.yarnpkg.com/en/package/@nestjs/swagger)
* [🐈‍⬛ typeorm](https://classic.yarnpkg.com/en/package/@nestjs/typeorm)
* [🐈‍⬛ typeorm-paginate](https://classic.yarnpkg.com/en/package/nestjs-typeorm-paginate)
* [🧦 ts-jest](https://classic.yarnpkg.com/en/package/@golevelup/ts-jest)
* [👍 cross-env](https://classic.yarnpkg.com/en/package/cross-env)
