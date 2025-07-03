// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // when there are uncaught JavaScript exceptions
  console.log('Uncaught exception:', err.message);
  return false;
});

// Global before hook - runs once before all tests
before(() => {
  cy.log('Starting Deepfake Detection Test Suite');
  
  // Verify servers are available
  cy.request({
    url: Cypress.env('apiUrl').replace('/api', '/'),
    failOnStatusCode: false
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('Backend server not available');
    }
  });

  cy.visit('/', { failOnStatusCode: false }).then(() => {
    cy.log('Frontend server verified');
  });
});

// Global beforeEach hook - runs before each test
beforeEach(() => {
  // Clear all application data before each test
  cy.clearAllStorage();
  
  // Set up common viewport
  cy.viewport(1280, 720);
  
  // Common request interceptors
  cy.intercept('POST', '/api/auth/register').as('register');
  cy.intercept('POST', '/api/auth/login').as('login');
  cy.intercept('GET', '/api/user').as('getUser');
  cy.intercept('PUT', '/api/user').as('updateUser');
  cy.intercept('POST', '/api/detect').as('detectFile');
  cy.intercept('GET', '/api/analyses').as('getAnalyses');
});

// Global afterEach hook - runs after each test
afterEach(() => {
  // Clean up any test data if needed
  cy.log('Test completed');
});

// Add custom assertions
chai.use((chai, utils) => {
  chai.Assertion.addMethod('containOneOf', function (list) {
    const obj = utils.flag(this, 'object');
    const found = list.some(item => obj.includes(item));
    
    this.assert(
      found,
      `expected #{this} to contain one of #{exp}`,
      `expected #{this} to not contain any of #{exp}`,
      list,
      obj
    );
  });
});

// Configure default command timeout
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 15000);
Cypress.config('responseTimeout', 15000);

// Add console logging for debugging
Cypress.on('window:before:load', (win) => {
  win.console.log = cy.log;
  win.console.error = cy.log;
  win.console.warn = cy.log;
});

// Hide XHR requests from the command log (optional)
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
