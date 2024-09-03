# Variables
DOCKER_COMPOSE = docker-compose
APP_CONTAINER = laravel_app
QUEUE_CONTAINER = laravel_queue_worker

# Rebuild everything from scratch
rebuild: clean build install

# Stop and remove all containers, volumes, and images related to the app
clean-all: clean
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

# Stop and remove all containers and volumes related to the app
clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Build everything from scratch without using cache
build:
	$(DOCKER_COMPOSE) build --no-cache

# Install the app (start services, install dependencies, run migrations)
install: start
	docker exec $(APP_CONTAINER) composer install

# Start the app (Docker containers)
start:
	$(DOCKER_COMPOSE) up -d

# Stop the app (Docker containers)
stop:
	$(DOCKER_COMPOSE) down

# SSH into the app container using docker exec
ssh:
	docker exec -it $(APP_CONTAINER) /bin/sh

ssh-queue:
	docker exec -it $(APP_CONTAINER) /bin/sh

# Run migration
migrate:
	docker exec -it $(APP_CONTAINER) php artisan migrate

clear-cache:
	docker exec -it $(APP_CONTAINER) php artisan optimize:clear
	docker exec -it $(APP_CONTAINER) php artisan route:cache
	docker exec -it $(APP_CONTAINER) php artisan config:cache
	docker exec -it $(QUEUE_CONTAINER) php artisan optimize:clear
	docker exec -it $(QUEUE_CONTAINER) php artisan route:cache
	docker exec -it $(QUEUE_CONTAINER) php artisan config:cache

# Run PHP unit tests
test:
	docker exec -it $(APP_CONTAINER) php artisan test

.PHONY: rebuild clean-all clean build install start stop ssh test
