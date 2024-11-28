# Use an official PHP image as the base
FROM cyberduck/php-fpm-laravel:8.2
# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the application code from the current directory
COPY . /var/www/html

# Install application dependencies
RUN composer install
# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
