# Jest Testing Suite - VeriFake Deepfake Detection

## 🎯 Overview
Comprehensive unit and integration testing suite for the Deepfake Detection application built with Jest, React Testing Library, and custom testing utilities. This suite ensures code quality, reliability, and maintains high test coverage across all application components.

## � Tech Stack
- **Testing Framework**: Jest 29+
- **React Testing**: React Testing Library
- **Mocking**: Jest mocks + MSW (Mock Service Worker)
- **Coverage**: Istanbul
- **Assertions**: Jest matchers + Custom matchers
- **Environment**: jsdom (browser simulation)

## 📁 Project Structure
```
jest/
├── __tests__/
│   ├── components/            # Component unit tests
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── ui/               # UI components
│   │   └── common/           # Shared components
│   ├── pages/                # Page component tests
│   │   ├── LoginPage.test.js
│   │   ├── Dashboard.test.js
│   │   └── ResultsPage.test.js
│   ├── services/             # Service layer tests
│   │   ├── api.test.js
│   │   ├── auth.test.js
│   │   └── analysis.test.js
│   ├── hooks/                # Custom hooks tests
│   │   ├── useAuth.test.js
│   │   └── useFileUpload.test.js
│   ├── utils/                # Utility function tests
│   │   ├── validation.test.js
│   │   └── helpers.test.js
│   └── integration/          # Integration tests
│       ├── auth-flow.test.js
│       └── upload-flow.test.js
├── __mocks__/                # Mock implementations
│   ├── api/                  # API mocks
│   ├── components/           # Component mocks
│   └── services/             # Service mocks
├── coverage/                 # Coverage reports
├── setupTests.js            # Test environment setup
├── jest.config.js           # Jest configuration
└── package.json             # Dependencies & scripts
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Navigate to jest directory
cd jest

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test suite
npm run test:components
npm run test:services
npm run test:integration
```

## ⚙️ Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).{js,jsx}',
    '**/*.(test|spec).{js,jsx}'
  ]
};
```

### Test Environment Setup (`setupTests.js`)
```javascript
import '@testing-library/jest-dom';
import { server } from './__mocks__/server';

// MSW server setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or higher
- npm or yarn package manager
- Backend server running on `http://127.0.0.1:8001/`
- Frontend server running on `http://localhost:5173`

### Installation & Setup

```bash
# Navigate to jest directory
cd jest

# Install dependencies
npm install

# Run setup script
npm run setup

# Run your first test
npm test
```

### First Test Run

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (recommended for development)
npm run test:watch

# Run specific test category
npm run test:frontend
```

## 📁 Project Structure

```
jest/
├── __tests__/                 # Test files
│   ├── backend/              # Backend API tests
│   │   ├── auth.test.js      # Authentication endpoints
│   │   └── detection.test.js # File detection endpoints
│   └── frontend/             # Frontend component tests
│       ├── auth.test.js      # Authentication components
│       ├── dashboard.test.js # Dashboard and file upload
│       └── services.test.js  # Services and utilities
├── __mocks__/                # Mock implementations
│   ├── axios.js             # HTTP client mock
│   └── react-router-dom.js  # Router mock
├── fixtures/                 # Test data
│   ├── users.json           # User test data
│   └── detection.json       # Detection test data
├── utils/                    # Test utilities
│   └── testHelpers.js       # Helper functions and classes
├── coverage/                 # Coverage reports (generated)
├── package.json             # Dependencies and scripts
├── jest.setup.js            # Global test configuration
├── babel.config.js          # Babel configuration
├── setup.js                 # Setup automation script
├── help.js                  # Help and documentation
└── README.md               # This file
```

## 🎯 Available Commands

### Basic Commands
```bash
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run with coverage report
npm run test:verbose        # Run with detailed output
npm run test:silent         # Run with minimal output
```

### Test Categories
```bash
npm run test:backend        # Backend API tests only
npm run test:frontend       # Frontend component tests only
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:api            # API-related tests
npm run test:components     # Component tests
npm run test:services       # Service tests
npm run test:utils          # Utility tests
```

### Advanced Commands
```bash
npm run test:debug          # Debug mode with breakpoints
npm run lint               # Check test code quality
npm run setup              # Re-run setup and health check
npm run clean              # Clean cache and dependencies
npm run help               # Show help guide
```

### Direct Jest Commands
```bash
# Run specific test file
jest auth.test.js

# Run tests matching pattern
jest --testNamePattern="should login"

# Run tests in specific directory
jest --testPathPattern=backend

# Watch specific tests
jest --watch auth

# Coverage for specific files
jest --coverage --collectCoverageFrom="**/__tests__/**/*.js"
```

## 🏷️ Test Categories

### Backend Tests (`__tests__/backend/`)

**Authentication Tests (`auth.test.js`)**
- User registration validation
- Login/logout functionality
- Token management
- Profile updates
- Error handling

**Detection Tests (`detection.test.js`)**
- File upload validation
- Analysis processing
- Result retrieval
- Service integration
- Error scenarios

### Frontend Tests (`__tests__/frontend/`)

**Authentication Components (`auth.test.js`)**
- Login form functionality
- Registration form validation
- Authentication context
- Error display
- User interactions

**Dashboard Components (`dashboard.test.js`)**
- File upload interface
- Drag and drop functionality
- Service selection
- Progress tracking
- Results display

**Services and Utilities (`services.test.js`)**
- API service functions
- Validation utilities
- Storage helpers
- Async operations
- Error handling

## ✍️ Writing Tests

### Test File Structure

```javascript
/**
 * Test File Template
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockDataGenerator } from '../../utils/testHelpers';

describe('Component/Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  describe('Unit Tests - Feature Description', () => {
    test('should do something specific', async () => {
      // Arrange
      const mockData = MockDataGenerator.createMockUser();
      
      // Act
      const result = await functionUnderTest(mockData);
      
      // Assert
      expect(result).toBe('expected outcome');
    });
  });

  describe('Integration Tests - Workflow', () => {
    test('should complete full workflow', async () => {
      // Test complete user journey
    });
  });
});
```

### Available Test Utilities

```javascript
import {
  ApiTestHelper,      // API testing utilities
  MockDataGenerator,  // Generate test data
  ComponentTestHelper, // Component testing helpers
  ValidationHelper,   // Validation functions
  AsyncTestHelper,    // Async operation helpers
  ErrorTestHelper,    // Error simulation
} from '../../utils/testHelpers';
```

### Common Test Patterns

**API Testing:**
```javascript
test('should authenticate user', async () => {
  const apiHelper = new ApiTestHelper();
  const credentials = { email: 'test@test.com', password: 'password' };
  
  const result = await apiHelper.login(credentials);
  
  expect(result.success).toBe(true);
  expect(result.data.token).toBeDefined();
});
```

**Component Testing:**
```javascript
test('should handle file upload', async () => {
  const mockFile = MockDataGenerator.createMockFile();
  const mockUpload = jest.fn();
  
  render(<FileUpload onUpload={mockUpload} />);
  
  const fileInput = screen.getByTestId('file-input');
  await userEvent.upload(fileInput, mockFile);
  
  expect(mockUpload).toHaveBeenCalledWith(mockFile);
});
```

**Async Testing:**
```javascript
test('should wait for analysis completion', async () => {
  const condition = () => analysis.status === 'completed';
  
  await AsyncTestHelper.waitFor(condition, 5000);
  
  expect(analysis.result).toBeDefined();
});
```

## ✨ Best Practices

### Writing Good Tests

1. **Descriptive Names**: Use clear, descriptive test names
   ```javascript
   // Good
   test('should display error message when login fails')
   
   // Bad
   test('login test')
   ```

2. **Arrange-Act-Assert Pattern**: Structure tests clearly
   ```javascript
   test('should calculate total price', () => {
     // Arrange
     const items = [{ price: 10 }, { price: 20 }];
     
     // Act
     const total = calculateTotal(items);
     
     // Assert
     expect(total).toBe(30);
   });
   ```

3. **Independent Tests**: Each test should be able to run alone
   ```javascript
   beforeEach(() => {
     // Reset state before each test
     jest.clearAllMocks();
     localStorage.clear();
   });
   ```

4. **Mock External Dependencies**: Isolate the code under test
   ```javascript
   jest.mock('axios');
   const mockAxios = axios as jest.Mocked<typeof axios>;
   ```

### Test Organization

- Group related tests with `describe` blocks
- Use `beforeEach`/`afterEach` for setup and cleanup
- Test both success and error scenarios
- Include edge cases and boundary conditions

### Performance Considerations

- Use `test.only()` to run single tests during development
- Mock heavy operations (API calls, file operations)
- Use `--runInBand` for debugging
- Keep test data small and focused

## 🔧 Troubleshooting

### Common Issues

**Tests Are Failing:**
```bash
# Check dependencies
npm install

# Verify setup
npm run setup

# Run with verbose output
npm run test:verbose
```

**Tests Are Slow:**
```bash
# Run in band (sequential)
jest --runInBand

# Check for async issues
npm run test:debug
```

**Coverage Issues:**
```bash
# Generate detailed coverage
npm run test:coverage

# Check specific files
jest --coverage --collectCoverageFrom="**/*.js"
```

**Setup Problems:**
```bash
# Clean install
npm run clean
npm install

# Re-run setup
npm run setup

# Check Node.js version
node --version  # Should be 14+
```

### Getting Help

```bash
# Show all help topics
npm run help

# Specific help topics
node help.js commands      # Available commands
node help.js patterns      # Test patterns
node help.js troubleshoot  # Troubleshooting guide
node help.js examples      # Code examples
```

## ⚙️ Configuration

### Jest Configuration (`package.json`)

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "testMatch": ["**/__tests__/**/*.test.js"],
    "collectCoverageFrom": ["**/*.{js,jsx}"],
    "moduleNameMapping": {
      "^@/(.*)$": "<rootDir>/$1"
    }
  }
}
```

### Environment Variables

Create `.env.test` file:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8001/api
NODE_ENV=test
```

### Custom Matchers

Available custom matchers:
```javascript
expect(received).toBeWithinRange(floor, ceiling)
expect(received).toHaveValidToken()
```

## 📊 Coverage Reports

### Generating Coverage

```bash
# Generate all coverage formats
npm run test:coverage

# HTML report (recommended)
npm run test:coverage && open coverage/lcov-report/index.html

# Text summary
jest --coverage --coverageReporters=text-summary
```

### Coverage Thresholds

Configured thresholds:
- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

### Interpreting Coverage

- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of if/else branches taken
- **Statements**: Percentage of statements executed

## 🎯 Testing Checklist

Before submitting code, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Coverage meets thresholds (`npm run test:coverage`)
- [ ] No console errors or warnings
- [ ] Tests are independent and can run in any order
- [ ] Mock external dependencies appropriately
- [ ] Test both success and error scenarios
- [ ] Include integration tests for user workflows
- [ ] Test files are properly named (*.test.js)
- [ ] Tests have descriptive names and clear assertions

## 🔗 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Happy Testing!** 🧪✨

For questions or issues, run `npm run help` or check the troubleshooting section above.
