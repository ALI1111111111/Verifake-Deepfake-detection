# Cyprus - Cypress E2E Testing Suite

## 🎯 Overview
Comprehensive end-to-end testing suite for the Deepfake Detection application using Cypress. These tests verify the complete user journey from authentication to file analysis across web and API interfaces.

## 🚀 Tech Stack
- **Testing Framework**: Cypress 13+
- **Language**: JavaScript/TypeScript
- **Reporting**: Mochawesome
- **CI/CD**: GitHub Actions ready
- **Coverage**: Code coverage integration

## 📁 Test Structure
```
cyprus/
├── cypress/
│   ├── e2e/
│   │   ├── frontend/          # Frontend UI tests
│   │   │   ├── 01-basic-navigation.cy.js
│   │   │   ├── 02-auth-pages.cy.js
│   │   │   ├── 03-dashboard-ui.cy.js
│   │   │   └── 04-basic-functionality.cy.js
│   │   ├── api/               # Backend API tests
│   │   │   ├── 01-basic-connectivity.cy.js
│   │   │   ├── 02-auth-endpoints.cy.js
│   │   │   └── 03-analysis-endpoints.cy.js
│   │   └── integration/       # Full integration tests
│   │       ├── 01-basic-flow.cy.js
│   │       └── 02-file-upload-flow.cy.js
│   ├── fixtures/              # Test data
│   ├── support/               # Commands & utilities
│   └── screenshots/           # Test artifacts
├── cypress.config.js          # Cypress configuration
├── package.json              # Dependencies
└── run-basic-tests.js        # Test runner script
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- Frontend server running on `http://localhost:5173`
- Backend server running on `http://localhost:8000`

### Installation
```bash
# Navigate to cyprus directory
cd cyprus

# Install dependencies
npm install

# Run tests in headless mode
npm test

# Run tests in interactive mode
npm run cy:open

# Run specific test suite
npm run test:frontend
npm run test:api
npm run test:integration
```

## ⚙️ Configuration

### Cypress Configuration (`cypress.config.js`)
```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 1
    },
    env: {
      apiUrl: 'http://127.0.0.1:8001/api',
      frontendUrl: 'http://localhost:5173',
      testEmail: 'test@example.com',
      testPassword: 'password123'
    }
  }
});
```

### Environment Variables
```bash
# Create cypress.env.json
{
  "apiUrl": "http://127.0.0.1:8001/api",
  "frontendUrl": "http://localhost:5173",
  "testEmail": "test@example.com",
  "testPassword": "password123",
  "adminEmail": "admin@example.com",
  "adminPassword": "password"
}
```

## 🧪 Test Suites

### Frontend Tests
**Navigation Tests** (`01-basic-navigation.cy.js`)
- Landing page loads correctly
- Navigation elements are present
- Auth buttons work properly
- Logo and branding display

**Authentication Tests** (`02-auth-pages.cy.js`)
- Login form validation
- Registration form functionality
- Brand section display
- Form input handling

**Dashboard Tests** (`03-dashboard-ui.cy.js`)
- Dashboard loads for authenticated users
- File upload dropzone functionality
- Service selection dropdown
- Analysis history display

**Functionality Tests** (`04-basic-functionality.cy.js`)
- Complete user workflow
- File upload process
- Navigation between pages
- Error handling

### API Tests
**Connectivity Tests** (`01-basic-connectivity.cy.js`)
- API server health check
- CORS configuration
- Response headers validation
- Error response handling

**Authentication Endpoints** (`02-auth-endpoints.cy.js`)
- User registration
- User login/logout
- Token validation
- Protected route access

**Analysis Endpoints** (`03-analysis-endpoints.cy.js`)
- File upload endpoint
- Analysis submission
- Results retrieval
- History endpoint

### Integration Tests
**Basic Flow** (`01-basic-flow.cy.js`)
- Complete user journey
- Login → Upload → Results
- Cross-system validation
- Data consistency checks

**File Upload Flow** (`02-file-upload-flow.cy.js`)
- End-to-end file processing
- Multiple file type support
- Progress tracking
- Result verification

## 🎯 Key Features

### Smart Selectors
Tests use real CSS selectors from the application:
```javascript
// Based on actual HTML structure
cy.get('.navbar').should('exist');
cy.get('.auth-buttons .btn').contains('Log In');
cy.get('.dashboard-card .dropzone');
cy.get('input[type="file"]');
```

### Robust Error Handling
```javascript
// Graceful failure handling
cy.visit('/', { failOnStatusCode: false });
cy.get('element', { timeout: 10000 });
cy.intercept('GET', '/api/**').as('apiCall');
```

### Test Data Management
```javascript
// Fixture-based test data
cy.fixture('users.json').then((users) => {
  cy.login(users.testUser.email, users.testUser.password);
});
```

## 📊 Custom Commands

### Authentication Commands
```javascript
// Login helper
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Logout helper
Cypress.Commands.add('logout', () => {
  cy.get('.logout-btn').click();
});
```

### File Upload Commands
```javascript
// File upload helper
Cypress.Commands.add('uploadFile', (fileName, fileType) => {
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`);
  cy.get('select[name="service"]').select(fileType);
  cy.get('button[type="submit"]').click();
});
```

## 📈 Reporting

### Mochawesome Reports
```bash
# Generate detailed HTML reports
npm run test:report

# View reports
open cypress/reports/mochawesome.html
```

### Screenshots & Videos
- Automatic screenshots on failure
- Video recording for debugging
- Organized by test suite and timestamp

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Start servers
        run: |
          npm run start:backend &
          npm run start:frontend &
          
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          working-directory: cyprus
          wait-on: 'http://localhost:5173, http://localhost:8000'
```

## 🔧 Performance Optimization

### Speed Improvements
- Reduced timeouts for faster feedback
- Parallel test execution
- Smart retry logic
- Minimal video recording

### Resource Management
```javascript
// Optimized configuration
{
  video: false,                    // Disable video for speed
  screenshotOnRunFailure: true,    // Only capture on failure
  trashAssetsBeforeRuns: true,     # Clean up between runs
  viewportWidth: 1280,            # Consistent viewport
  viewportHeight: 720
}
```

## 🐛 Debugging

### Debug Mode
```bash
# Run with debug output
DEBUG=cypress:* npm test

# Run single test with debug
npx cypress run --spec "cypress/e2e/frontend/01-basic-navigation.cy.js"

# Interactive debugging
npm run cy:open
```

### Common Issues
1. **Server not running**: Ensure both frontend and backend are active
2. **Selector changes**: Update selectors when UI changes
3. **Timing issues**: Adjust timeouts or add proper waits
4. **File uploads**: Verify file paths and permissions

## 📚 Best Practices

### Test Writing
1. **Use real selectors**: Match actual application structure
2. **Test user behavior**: Focus on user journeys, not implementation
3. **Keep tests independent**: Each test should work in isolation
4. **Use data attributes**: Add `data-cy` attributes for stable selectors

### Maintenance
1. **Regular updates**: Keep tests in sync with UI changes
2. **Refactor common actions**: Use custom commands for repeated actions
3. **Monitor flaky tests**: Identify and fix unstable tests
4. **Documentation**: Keep test documentation updated

## 🤝 Contributing
1. Follow the existing test structure
2. Write descriptive test names
3. Add comments for complex interactions
4. Test both happy path and edge cases
5. Update documentation for new test suites

## 📋 Quick Commands
```bash
# Essential commands
npm test                    # Run all tests
npm run cy:open            # Interactive mode
npm run test:frontend      # Frontend tests only
npm run test:api          # API tests only
npm run test:integration  # Integration tests only
npm run troubleshoot      # Debug helper
```
│           └── 01-basic-flow.cy.js
├── cypress.config.js          # Cypress configuration
├── package.json              # Dependencies and scripts
├── troubleshoot.js           # Troubleshooting tool
└── run-basic-tests.js        # Simple test runner
```

## 🚀 Quick Start

### 1. Prerequisites
Start your servers:
```bash
# Backend (Terminal 1)
cd ../backend
php artisan serve --host=127.0.0.1 --port=8001

# Frontend (Terminal 2) 
cd ../frontend
npm run dev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests

#### Simple Tests (Recommended)
```bash
npm run test:simple
```

#### All Basic Tests
```bash
npm run test:basic
```

#### Open Cypress GUI
```bash
npm run open
```

## 📊 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test:simple` | Run the most basic navigation and auth tests |
| `npm run test:basic` | Run all basic tests with detailed output |
| `npm run test:frontend` | Run all frontend tests |
| `npm run test:api` | Run API connectivity tests |
| `npm run open` | Open Cypress interactive GUI |
| `npm run troubleshoot` | Check server status and configuration |

## 🧪 Test Categories

### Frontend Tests
- **Navigation**: Basic page loading and navigation
- **Auth Pages**: Login and register form functionality  
- **Dashboard UI**: File upload and interface elements
- **Basic Functionality**: Cross-page navigation and interactions

### API Tests
- **Connectivity**: Backend server health checks
- **CORS**: Cross-origin request handling

### Integration Tests
- **Basic Flow**: Simple user journeys
- **Responsive Design**: Mobile/tablet/desktop views

## 🔧 Configuration

The tests are configured to:
- ✅ Use flexible selectors that work with your HTML
- ✅ Handle expected failures gracefully
- ✅ Retry failed tests automatically
- ✅ Focus on essential functionality
- ✅ Work without complex authentication flows

## 🐛 Troubleshooting

### Server Issues
```bash
npm run troubleshoot
```

### Individual Test Debugging
```bash
# Run specific test file
npx cypress run --spec "cypress/e2e/frontend/01-basic-navigation.cy.js"

# Open specific test in GUI
npm run open
```

### Common Issues
- **ECONNREFUSED**: Backend server not running
- **Page not found**: Frontend server not running  
- **Selector not found**: HTML structure changed

## 💡 Tips for Success

1. **Start Simple**: Always run `npm run test:simple` first
2. **Check Servers**: Use `npm run troubleshoot` to verify server status
3. **Use GUI**: Cypress GUI shows exactly what's happening during tests
4. **One at a time**: Run individual test files to isolate issues

## 🎉 Success Metrics

These basic tests should achieve:
- **High pass rate** (90%+ for basic functionality)
- **Fast execution** (under 2 minutes for simple tests)
- **Reliable results** (consistent across runs)
- **Easy debugging** (clear error messages)

Focus on getting the basic tests passing first, then gradually add more complex scenarios as needed!
