const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Frontend Vite dev server
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Disable video to speed up tests
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000, // Reduced timeout
    requestTimeout: 10000, // Reduced timeout
    responseTimeout: 10000, // Reduced timeout
    retries: {
      runMode: 2, // Retry failed tests
      openMode: 1
    },
    env: {
      apiUrl: 'http://127.0.0.1:8001/api', // Laravel backend API
      frontendUrl: 'http://localhost:5173',
      testEmail: 'test@example.com',
      testPassword: 'password123',
      adminEmail: 'admin@example.com',
      adminPassword: 'password'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})
