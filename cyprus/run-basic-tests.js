#!/usr/bin/env node

/**
 * Simple Test Runner for Basic Cypress Tests
 */

const { exec } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function runBasicTests() {
  log('🚀 Running Basic Cypress Tests\n', colors.blue);
  
  try {
    // Run simple tests first
    log('Running navigation and auth tests...', colors.yellow);
    exec('npx cypress run --spec "cypress/e2e/frontend/01-basic-navigation.cy.js,cypress/e2e/frontend/02-auth-pages.cy.js"', 
      (error, stdout, stderr) => {
        if (error) {
          log('❌ Some tests failed, but continuing...', colors.red);
        } else {
          log('✅ Basic tests completed!', colors.green);
        }
        console.log(stdout);
      });

  } catch (error) {
    log('❌ Error running tests:', colors.red);
    log(error.message, colors.red);
  }
}

if (require.main === module) {
  runBasicTests();
}

module.exports = { runBasicTests };
