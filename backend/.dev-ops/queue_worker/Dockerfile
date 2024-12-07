# First stage: Build the app image using the php-app Dockerfile
FROM php:8.2-fpm AS app-base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd \
    && pecl install redis \
    && docker-php-ext-enable redis
    
# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the application code from the current directory
COPY . /var/www/html

# Install application dependencies
RUN composer install

# Second stage: Build the queue worker
FROM app-base AS queue-worker

# Install Supervisor
RUN apt-get update && apt-get install -y supervisor

# Copy Supervisor configuration from the queue_worker directory
COPY .dev-ops/queue_worker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set the working directory
WORKDIR /var/www/html

# Run Laravel commands and Supervisor
CMD /bin/sh -c "php artisan config:cache && \
                php artisan route:cache && \
                supervisord -c /etc/supervisor/conf.d/supervisord.conf"
