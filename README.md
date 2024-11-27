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

3. From the project root directory, build and start the Docker containers:
    ```bash
      make build
      make migrate
    ```
4. Once the services are running, open your browser and navigate to:
   ```
    http://localhost:8080
   ```
5. Move to the frontend directory and run the following commands:
    ```bash
    cd ../frontend
    npm install
    npm start
    ```
