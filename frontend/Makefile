# Variables
NPM = npm

# Install dependencies
install:
	$(NPM) install

# Start the development server
start:
	$(NPM) run start

# Build the production version of the app
build:
	$(NPM) run build

# Run tests
test:
	$(NPM) run test

# Run ESLint
lint:
	$(NPM) run lint

# Format code with Prettier
prettier:
	$(NPM) run prettier

# Clean the node_modules folder
clean:
	rm -rf node_modules

# Reinstall dependencies
reinstall: clean install

.PHONY: install start build test lint prettier clean reinstall