/**
 * Test Utilities for Jest Tests
 * Common functions and helpers used across test files
 */

import axios from 'axios';

// API Test Helpers
export class ApiTestHelper {
  constructor(baseUrl = 'http://127.0.0.1:8001/api') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setAuthToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async makeRequest(method, endpoint, data = null) {
    const config = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: this.getHeaders(),
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  // Authentication helpers
  async register(userData) {
    return this.makeRequest('POST', '/auth/register', userData);
  }

  async login(credentials) {
    return this.makeRequest('POST', '/auth/login', credentials);
  }

  async getUser() {
    return this.makeRequest('GET', '/user');
  }

  async updateUser(userData) {
    return this.makeRequest('PUT', '/user', userData);
  }

  // Detection helpers
  async uploadFile(fileData, service) {
    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('service', service);

    const config = {
      method: 'POST',
      url: `${this.baseUrl}/detect`,
      headers: {
        'Accept': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : undefined,
      },
      data: formData,
    };

    try {
      const response = await axios(config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  async getAnalyses() {
    return this.makeRequest('GET', '/analyses');
  }

  async getAnalysis(id) {
    return this.makeRequest('GET', `/analyses/${id}`);
  }
}

// Mock Data Generators
export class MockDataGenerator {
  static createMockFile(options = {}) {
    const defaults = {
      name: 'test-image.jpg',
      type: 'image/jpeg',
      size: 1024000,
      lastModified: Date.now(),
    };

    const fileOptions = { ...defaults, ...options };
    
    // Create a mock file object
    const file = new File(['mock file content'], fileOptions.name, {
      type: fileOptions.type,
      lastModified: fileOptions.lastModified,
    });

    // Add size property
    Object.defineProperty(file, 'size', {
      value: fileOptions.size,
      writable: false,
    });

    return file;
  }

  static createMockUser(overrides = {}) {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      email_verified_at: '2025-01-01T00:00:00.000000Z',
      api_requests_count: 0,
      api_requests_limit: 100,
      is_admin: false,
      created_at: '2025-01-01T00:00:00.000000Z',
      updated_at: '2025-01-01T00:00:00.000000Z',
      ...overrides,
    };
  }

  static createMockAnalysis(overrides = {}) {
    return {
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
    };
  }

  static createMockApiResponse(data, status = 200, message = 'Success') {
    return {
      success: status >= 200 && status < 300,
      message,
      data,
      status,
    };
  }
}

// Component Test Helpers
export class ComponentTestHelper {
  static mockLocalStorage() {
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
    });

    return mockStorage;
  }

  static mockFetch(mockResponse) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      })
    );

    return global.fetch;
  }

  static createMockEvent(type, properties = {}) {
    return {
      type,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      target: {
        value: '',
        checked: false,
        files: [],
        ...properties.target,
      },
      ...properties,
    };
  }

  static waitForElement(selector, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const check = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(check, 10);
        }
      };
      
      check();
    });
  }
}

// Validation Test Helpers
export class ValidationHelper {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  }

  static validateFileSize(file, maxSize) {
    return file.size <= maxSize;
  }
}

// Async Test Helpers
export class AsyncTestHelper {
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async waitFor(condition, timeout = 5000, interval = 100) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await this.delay(interval);
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  static createTimeout(ms, value) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });
  }

  static raceWithTimeout(promise, timeout) {
    return Promise.race([
      promise,
      this.createTimeout(timeout, null),
    ]);
  }
}

// Error Testing Helpers
export class ErrorTestHelper {
  static createNetworkError() {
    const error = new Error('Network Error');
    error.code = 'NETWORK_ERROR';
    return error;
  }

  static createValidationError(errors) {
    const error = new Error('Validation Error');
    error.response = {
      status: 422,
      data: {
        message: 'The given data was invalid.',
        errors,
      },
    };
    return error;
  }

  static createAuthError() {
    const error = new Error('Unauthorized');
    error.response = {
      status: 401,
      data: {
        message: 'Unauthenticated.',
      },
    };
    return error;
  }

  static createServerError() {
    const error = new Error('Internal Server Error');
    error.response = {
      status: 500,
      data: {
        message: 'Server Error',
      },
    };
    return error;
  }
}

// Performance Test Helpers
export class PerformanceTestHelper {
  static measureExecutionTime(fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    return {
      result,
      executionTime: end - start,
    };
  }

  static async measureAsyncExecutionTime(asyncFn) {
    const start = performance.now();
    const result = await asyncFn();
    const end = performance.now();
    
    return {
      result,
      executionTime: end - start,
    };
  }

  static createPerformanceThreshold(maxTime) {
    return {
      toBeWithinPerformanceThreshold: (received) => {
        const pass = received <= maxTime;
        return {
          message: () => 
            pass 
              ? `Expected execution time ${received}ms to exceed ${maxTime}ms`
              : `Expected execution time ${received}ms to be within ${maxTime}ms`,
          pass,
        };
      },
    };
  }
}

export default {
  ApiTestHelper,
  MockDataGenerator,
  ComponentTestHelper,
  ValidationHelper,
  AsyncTestHelper,
  ErrorTestHelper,
  PerformanceTestHelper,
};
