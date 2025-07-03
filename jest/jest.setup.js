// Jest configuration and setup file
import '@testing-library/jest-dom';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore console outputs
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.sessionStorage = sessionStorageMock;

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock window.alert, confirm, prompt
window.alert = jest.fn();
window.confirm = jest.fn();
window.prompt = jest.fn();

// Mock fetch API
global.fetch = jest.fn();

// Mock File and FileReader for file upload tests
global.File = class MockFile {
  constructor(parts, filename, properties) {
    this.parts = parts;
    this.name = filename;
    this.size = properties?.size || 0;
    this.type = properties?.type || '';
    this.lastModified = properties?.lastModified || Date.now();
  }
};

global.FileReader = class MockFileReader {
  constructor() {
    this.readyState = 0;
    this.result = null;
    this.error = null;
  }
  
  readAsDataURL() {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'data:image/jpeg;base64,mock-base64-data';
      if (this.onload) this.onload();
    }, 0);
  }
  
  readAsText() {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'mock file content';
      if (this.onload) this.onload();
    }, 0);
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toHaveValidToken(received) {
    const tokenPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    const pass = tokenPattern.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT token`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT token`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.testUtils = {
  // Create mock user
  createMockUser: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    email_verified_at: '2025-01-01T00:00:00.000000Z',
    api_requests_count: 0,
    api_requests_limit: 100,
    created_at: '2025-01-01T00:00:00.000000Z',
    updated_at: '2025-01-01T00:00:00.000000Z',
    ...overrides,
  }),

  // Create mock analysis
  createMockAnalysis: (overrides = {}) => ({
    id: 1,
    user_id: 1,
    file_name: 'test-image.jpg',
    file_path: '/storage/uploads/test-image.jpg',
    service: 'deepfake',
    status: 'completed',
    result: {
      confidence: 0.85,
      prediction: 'real',
      analysis_time: 1.23,
    },
    created_at: '2025-01-01T00:00:00.000000Z',
    updated_at: '2025-01-01T00:00:00.000000Z',
    ...overrides,
  }),

  // Create mock API response
  createMockApiResponse: (data, status = 200) => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: {},
  }),

  // Wait for async operations
  waitFor: (callback, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          const result = callback();
          if (result) {
            resolve(result);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, 10);
          }
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },
};

// Reset mocks before each test
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Reset localStorage
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Reset sessionStorage
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  
  // Reset fetch
  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

// Global error handler for unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Set up default timeout for all tests
jest.setTimeout(30000);
