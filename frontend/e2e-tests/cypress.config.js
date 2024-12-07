const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/tests/**/*.cy.js",
    baseUrl: 'http://localhost:3000', // Change to your app's local dev URL
    supportFile: 'cypress/support/e2e.js', // Default support file
    fixturesFolder: 'cypress/fixtures', // Mock data folder
  },
});
