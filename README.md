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
└── Makefile                        # Makefile with backend commands
```

## Installation Guide

Follow these steps to set up the backend application:

### 1. Set Up Environment Variables

1. Navigate to the `backend` directory.
2. Create a `.env` file by copying the example file:
    ```bash
    cd backend
    cp .env.example .env
    ```
3. Edit the .env file and ensure the following variables are set:
    ```
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=13306
    MYSQL_ROOT_PASSWORD=yourpassword
    MYSQL_DATABASE=contacts_db
    MYSQL_USER=app
    MYSQL_PASSWORD=yourpassword
    ```

4. From the project root directory, build and start the Docker containers:
    ```bash
      make backend-rebuild
    ```
5. Once the services are running, open your browser and navigate to:
   ```
    http://localhost:8080
   ```