# Contacts Application

This project is a Contacts Application built with Laravel for the backend and  React for the frontend. The application allows users to create, read, update, and delete contacts. The backend is containerized using Docker, ensuring a consistent development environment.

## Project Structure

The project is organized as follows:

```plaintext
contacts-application/
├── backend/                       # Laravel backend application
│   ├── .dev-ops/                  # Docker-related files (Dockerfile, Nginx config)
│   **/**                          # Laravel application files
│   ├── docker-compose.yml         # Docker Compose configuration for backend services
├── frontend/                      # Frontend application directory
│   **/**                          # React application files
└──                       # Makefile with backend commands
```

## Installation Guide

Follow these steps to set up the backend application:

### Preparation Step: Install Docker and Docker Compose

1. Install Docker:
    - Download and install Docker from the [official website](https://www.docker.com/products/docker-desktop).

2. Verify Docker installation:
   ```bash
   docker --version
   docker-compose --version
   ```

### 1. Set Up Environment Variables

1. Navigate to the `backend` directory.
2. Create a `.env` file by copying the example file:
    ```bash
    cd backend
    cp .env.example .env
    ```

### 2. Build and start backend(API)
1. From the project root directory, build and start the Docker containers:
    ```bash
      make build
      make start
      make key
      make migrate
      make seed
    ```
2. Once the services are running, open your browser and navigate to:
   ```
    http://localhost:8080
   ```
### 3. Build and start Front-end (React App)

#### Preparation:
1. Check if you have node js and npm
```bash
node -v && nvm -v
```
I am using below versions (most actual at moment of dev):
```aiignore
v23.1.0
0.39.7
```
2. Create a `.env` file by copying the example file:
    ```bash
    cd frontend
    cp .env.example .env
    ```

3. If no node / npm, install via Homebrew(OSX):
```aiignore
#check you have Homebrew
brew -v
#if no brew install:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
##
brew update && brew install node
```

#### Build:
1. Move to the frontend directory and run the following commands:
    ```bash
    cd ../frontend
    npm install
    npm start
    ```


### 4. Automation Framework (UI and API)

Playwright framework was selected to support UI and API Automation. It allows testing [Chromium](https://www.chromium.org/Home), [Firefox](https://www.mozilla.org/en-US/firefox/new/) and [WebKit](https://webkit.org/) with a single API. Playwright is built to enable cross-browser web automation that is **ever-green**, **capable**, **reliable** and **fast**.

Headless execution is supported for all browsers on all platforms. Check out [system requirements](https://playwright.dev/docs/library#system-requirements) for details.

The project is organized as follows:

```plaintext

├── automation                  # Test Automation framework location.
│   ├── src   
│       ├── data                # Test data is used to provide input to the test.
│       ├── fixtures            # Test fixtures are used to establish the environment for each test, giving the test everything it needs. 
│       ├── pages               # POM approach simplifies maintenance by capturing element selectors in one place and creates reusable code to avoid repetition.             
│   ├── tests                   # Test scenarios are the test cases that are executed.
│       ├── api                 # Tests for the backend.
│       └── e2e                 # Tests for the frontend.

```


# <!--Local Installation -->
## Local Installation

Playwright has its own test runner for end-to-end tests called Playwright Test.

To install locally with npm:

```sh
# run from your root automation directory
npm i install

# install supported browsers
npx playwright install  

# create a `.env` file by copying the example file:
    ```bash
    cd automation
    cp .env.example .

```

# <!-- Running Tests -->
## Running Tests

```sh
# to run all tests
npx playwright test

# to run ui tests only
npx playwright test tests/e2e

# to run api tests only
npx playwright test tests/api

# to skip slow tests
npx playwright test --grep @fast

# generate report
npx playwright show-report

# debug tests
npx playwright test test_filename --debug

```

