# Cyprus - Cypress E2E Tests for Deepfake Detection

## 🎯 Overview

Simple, reliable Cypress tests for the Deepfake Detection application. These tests focus on basic functionality and are designed to pass consistently.

## 📁 Test Structure

```
cyprus/
├── cypress/
│   └── e2e/
│       ├── frontend/          # Frontend UI tests
│       │   ├── 01-basic-navigation.cy.js
│       │   ├── 02-auth-pages.cy.js
│       │   ├── 03-dashboard-ui.cy.js
│       │   └── 04-basic-functionality.cy.js
│       ├── api/               # Backend API tests
│       │   └── 01-basic-connectivity.cy.js
│       └── integration/       # Integration tests
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
