/**
 * Services and Utilities Tests
 * Unit tests for API service, validation utilities, and helper functions
 */

import { 
  ValidationHelper, 
  AsyncTestHelper, 
  ErrorTestHelper,
  MockDataGenerator 
} from '../../utils/testHelpers';
import detectionFixture from '../../fixtures/detection.json';
import usersFixture from '../../fixtures/users.json';

// Mock API service
const mockApiService = {
  baseURL: 'http://127.0.0.1:8001/api',
  token: null,
  
  setToken(token) {
    this.token = token;
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  },

  async request(method, endpoint, data = null) {
    // Simulate network delay
    await AsyncTestHelper.delay(Math.random() * 100);
    
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      url,
      headers: this.getHeaders(),
    };
    
    if (data) {
      config.data = data;
    }
    
    // Simulate different responses based on endpoint and data
    return this.simulateResponse(method, endpoint, data);
  },

  simulateResponse(method, endpoint, data) {
    // Auth endpoints
    if (endpoint === '/auth/login' && method === 'POST') {
      if (data.email === 'valid@test.com' && data.password === 'password') {
        return Promise.resolve({
          data: {
            success: true,
            token: 'mock-jwt-token',
            user: MockDataGenerator.createMockUser(),
          },
          status: 200,
        });
      } else {
        return Promise.reject(ErrorTestHelper.createAuthError());
      }
    }

    if (endpoint === '/auth/register' && method === 'POST') {
      if (ValidationHelper.validateEmail(data.email)) {
        return Promise.resolve({
          data: {
            success: true,
            token: 'mock-jwt-token',
            user: MockDataGenerator.createMockUser(data),
          },
          status: 201,
        });
      } else {
        return Promise.reject(ErrorTestHelper.createValidationError({
          email: ['Invalid email format'],
        }));
      }
    }

    // Detection endpoints
    if (endpoint === '/detect' && method === 'POST') {
      return Promise.resolve({
        data: detectionFixture.apiResponses.uploadSuccess,
        status: 201,
      });
    }

    if (endpoint === '/analyses' && method === 'GET') {
      return Promise.resolve({
        data: {
          data: detectionFixture.sampleAnalyses,
          pagination: { current_page: 1, total: 4 },
        },
        status: 200,
      });
    }

    // Default response
    return Promise.resolve({
      data: { success: true },
      status: 200,
    });
  },
};

// File validation utility
const fileValidator = {
  validateFileType(file, allowedTypes) {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '');
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });
  },

  validateFileSize(file, maxSize) {
    return file.size <= maxSize;
  },

  validateFile(file, config = {}) {
    const {
      allowedTypes = ['image/*', 'video/*'],
      maxSize = 10 * 1024 * 1024, // 10MB
    } = config;

    const errors = [];

    if (!this.validateFileType(file, allowedTypes)) {
      errors.push('Invalid file type');
    }

    if (!this.validateFileSize(file, maxSize)) {
      errors.push('File size too large');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Analysis service
const analysisService = {
  async analyzeFile(file, service) {
    // Validate file
    const validation = fileValidator.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Upload file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('service', service);

    const response = await mockApiService.request('POST', '/detect', formData);
    return response.data;
  },

  async getAnalysisStatus(analysisId) {
    const response = await mockApiService.request('GET', `/analyses/${analysisId}`);
    return response.data.analysis;
  },

  async getAllAnalyses() {
    const response = await mockApiService.request('GET', '/analyses');
    return response.data.data;
  },

  pollAnalysisStatus(analysisId, callback, interval = 2000) {
    const poll = async () => {
      try {
        const analysis = await this.getAnalysisStatus(analysisId);
        callback(null, analysis);
        
        if (analysis.status === 'processing') {
          setTimeout(poll, interval);
        }
      } catch (error) {
        callback(error, null);
      }
    };
    
    poll();
  },
};

// Local storage helper
const storageHelper = {
  setItem(key, value) {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Failed to set item in localStorage:', error);
      return false;
    }
  },

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      try {
        return JSON.parse(item);
      } catch {
        return item; // Return as string if not JSON
      }
    } catch (error) {
      console.error('Failed to get item from localStorage:', error);
      return defaultValue;
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  },
};

describe('Services and Utilities Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Unit Tests - Validation Helper', () => {
    test('should validate email addresses correctly', () => {
      // Valid emails
      expect(ValidationHelper.validateEmail('test@example.com')).toBe(true);
      expect(ValidationHelper.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationHelper.validateEmail('user+tag@example.org')).toBe(true);

      // Invalid emails
      expect(ValidationHelper.validateEmail('invalid-email')).toBe(false);
      expect(ValidationHelper.validateEmail('test@')).toBe(false);
      expect(ValidationHelper.validateEmail('@domain.com')).toBe(false);
      expect(ValidationHelper.validateEmail('')).toBe(false);
    });

    test('should validate passwords correctly', () => {
      // Valid passwords
      expect(ValidationHelper.validatePassword('Password123')).toBe(true);
      expect(ValidationHelper.validatePassword('StrongPass1')).toBe(true);
      expect(ValidationHelper.validatePassword('MySecure2024')).toBe(true);

      // Invalid passwords
      expect(ValidationHelper.validatePassword('weak')).toBe(false); // Too short
      expect(ValidationHelper.validatePassword('nouppercaseletter1')).toBe(false); // No uppercase
      expect(ValidationHelper.validatePassword('NOLOWERCASELETTER1')).toBe(false); // No lowercase
      expect(ValidationHelper.validatePassword('NoNumbersHere')).toBe(false); // No numbers
      expect(ValidationHelper.validatePassword('')).toBe(false); // Empty
    });

    test('should validate file types correctly', () => {
      const imageFile = MockDataGenerator.createMockFile({ type: 'image/jpeg' });
      const videoFile = MockDataGenerator.createMockFile({ type: 'video/mp4' });
      const textFile = MockDataGenerator.createMockFile({ type: 'text/plain' });

      expect(ValidationHelper.validateFileType(imageFile, ['image/jpeg', 'image/png'])).toBe(true);
      expect(ValidationHelper.validateFileType(videoFile, ['video/mp4', 'video/avi'])).toBe(true);
      expect(ValidationHelper.validateFileType(textFile, ['image/jpeg', 'video/mp4'])).toBe(false);
    });

    test('should validate file sizes correctly', () => {
      const smallFile = MockDataGenerator.createMockFile({ size: 1024 }); // 1KB
      const largeFile = MockDataGenerator.createMockFile({ size: 10 * 1024 * 1024 }); // 10MB

      expect(ValidationHelper.validateFileSize(smallFile, 5 * 1024 * 1024)).toBe(true); // Under 5MB limit
      expect(ValidationHelper.validateFileSize(largeFile, 5 * 1024 * 1024)).toBe(false); // Over 5MB limit
      expect(ValidationHelper.validateFileSize(largeFile, 15 * 1024 * 1024)).toBe(true); // Under 15MB limit
    });
  });

  describe('Unit Tests - File Validator', () => {
    test('should validate supported file types', () => {
      const imageFile = MockDataGenerator.createMockFile({ type: 'image/jpeg' });
      const videoFile = MockDataGenerator.createMockFile({ type: 'video/mp4' });
      const textFile = MockDataGenerator.createMockFile({ type: 'text/plain' });

      expect(fileValidator.validateFileType(imageFile, ['image/*'])).toBe(true);
      expect(fileValidator.validateFileType(videoFile, ['video/*'])).toBe(true);
      expect(fileValidator.validateFileType(textFile, ['image/*', 'video/*'])).toBe(false);
    });

    test('should validate file sizes', () => {
      const smallFile = MockDataGenerator.createMockFile({ size: 1024 * 1024 }); // 1MB
      const largeFile = MockDataGenerator.createMockFile({ size: 20 * 1024 * 1024 }); // 20MB

      expect(fileValidator.validateFileSize(smallFile, 10 * 1024 * 1024)).toBe(true);
      expect(fileValidator.validateFileSize(largeFile, 10 * 1024 * 1024)).toBe(false);
    });

    test('should perform complete file validation', () => {
      const validFile = MockDataGenerator.createMockFile({
        type: 'image/jpeg',
        size: 2 * 1024 * 1024, // 2MB
      });

      const invalidTypeFile = MockDataGenerator.createMockFile({
        type: 'text/plain',
        size: 1024 * 1024,
      });

      const invalidSizeFile = MockDataGenerator.createMockFile({
        type: 'image/jpeg',
        size: 20 * 1024 * 1024, // 20MB
      });

      expect(fileValidator.validateFile(validFile).isValid).toBe(true);
      expect(fileValidator.validateFile(invalidTypeFile).isValid).toBe(false);
      expect(fileValidator.validateFile(invalidSizeFile).isValid).toBe(false);
      
      expect(fileValidator.validateFile(invalidTypeFile).errors).toContain('Invalid file type');
      expect(fileValidator.validateFile(invalidSizeFile).errors).toContain('File size too large');
    });
  });

  describe('Unit Tests - API Service', () => {
    test('should set and include authentication token', () => {
      const token = 'test-token';
      mockApiService.setToken(token);

      const headers = mockApiService.getHeaders();
      expect(headers.Authorization).toBe(`Bearer ${token}`);
    });

    test('should make authenticated requests', async () => {
      mockApiService.setToken('valid-token');
      
      const response = await mockApiService.request('GET', '/user');
      expect(response.status).toBe(200);
    });

    test('should handle login requests', async () => {
      const validCredentials = { email: 'valid@test.com', password: 'password' };
      const response = await mockApiService.request('POST', '/auth/login', validCredentials);
      
      expect(response.status).toBe(200);
      expect(response.data.token).toBeDefined();
      expect(response.data.user).toBeDefined();
    });

    test('should handle invalid login credentials', async () => {
      const invalidCredentials = { email: 'invalid@test.com', password: 'wrong' };
      
      await expect(mockApiService.request('POST', '/auth/login', invalidCredentials))
        .rejects
        .toThrow();
    });

    test('should handle registration requests', async () => {
      const userData = usersFixture.validUser;
      const response = await mockApiService.request('POST', '/auth/register', userData);
      
      expect(response.status).toBe(201);
      expect(response.data.user.email).toBe(userData.email);
    });
  });

  describe('Unit Tests - Analysis Service', () => {
    beforeEach(() => {
      mockApiService.setToken('test-token');
    });

    test('should analyze valid files', async () => {
      const validFile = MockDataGenerator.createMockFile({
        type: 'image/jpeg',
        size: 2 * 1024 * 1024,
      });

      const result = await analysisService.analyzeFile(validFile, 'deepfake');
      
      expect(result.success).toBe(true);
      expect(result.analysis.status).toBe('processing');
    });

    test('should reject invalid file types', async () => {
      const invalidFile = MockDataGenerator.createMockFile({
        type: 'text/plain',
        size: 1024,
      });

      await expect(analysisService.analyzeFile(invalidFile, 'deepfake'))
        .rejects
        .toThrow('Invalid file type');
    });

    test('should reject oversized files', async () => {
      const largeFile = MockDataGenerator.createMockFile({
        type: 'image/jpeg',
        size: 20 * 1024 * 1024, // 20MB
      });

      await expect(analysisService.analyzeFile(largeFile, 'deepfake'))
        .rejects
        .toThrow('File size too large');
    });

    test('should get analysis status', async () => {
      const analysisId = 1;
      
      // Mock the specific endpoint response
      jest.spyOn(mockApiService, 'simulateResponse').mockImplementation((method, endpoint) => {
        if (endpoint === '/analyses/1') {
          return Promise.resolve({
            data: { analysis: detectionFixture.sampleAnalyses[0] },
            status: 200,
          });
        }
        return Promise.resolve({ data: {}, status: 200 });
      });

      const analysis = await analysisService.getAnalysisStatus(analysisId);
      expect(analysis.id).toBe(analysisId);
      expect(analysis.status).toBeDefined();
    });

    test('should get all analyses', async () => {
      const analyses = await analysisService.getAllAnalyses();
      
      expect(Array.isArray(analyses)).toBe(true);
      expect(analyses.length).toBeGreaterThan(0);
    });

    test('should poll analysis status for processing analyses', async () => {
      const analysisId = 1;
      const callback = jest.fn();
      
      // Mock changing status
      let callCount = 0;
      jest.spyOn(mockApiService, 'simulateResponse').mockImplementation(() => {
        callCount++;
        const status = callCount === 1 ? 'processing' : 'completed';
        return Promise.resolve({
          data: { 
            analysis: { 
              ...detectionFixture.sampleAnalyses[0], 
              status,
            } 
          },
          status: 200,
        });
      });

      analysisService.pollAnalysisStatus(analysisId, callback, 100); // Fast polling for test

      // Wait for multiple calls
      await AsyncTestHelper.waitFor(
        () => callback.mock.calls.length >= 2,
        2000
      );

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0][1].status).toBe('processing');
      expect(callback.mock.calls[1][1].status).toBe('completed');
    });
  });

  describe('Unit Tests - Storage Helper', () => {
    test('should store and retrieve string values', () => {
      const key = 'testKey';
      const value = 'testValue';

      expect(storageHelper.setItem(key, value)).toBe(true);
      expect(storageHelper.getItem(key)).toBe(value);
    });

    test('should store and retrieve JSON objects', () => {
      const key = 'userProfile';
      const value = { name: 'John', email: 'john@test.com' };

      expect(storageHelper.setItem(key, value)).toBe(true);
      expect(storageHelper.getItem(key)).toEqual(value);
    });

    test('should return default value for non-existent keys', () => {
      const defaultValue = 'default';
      
      expect(storageHelper.getItem('nonExistentKey', defaultValue)).toBe(defaultValue);
    });

    test('should remove items from storage', () => {
      const key = 'tempKey';
      storageHelper.setItem(key, 'tempValue');
      
      expect(storageHelper.removeItem(key)).toBe(true);
      expect(storageHelper.getItem(key)).toBeNull();
    });

    test('should clear all storage', () => {
      storageHelper.setItem('key1', 'value1');
      storageHelper.setItem('key2', 'value2');
      
      expect(storageHelper.clear()).toBe(true);
      expect(storageHelper.getItem('key1')).toBeNull();
      expect(storageHelper.getItem('key2')).toBeNull();
    });
  });

  describe('Unit Tests - Async Helper', () => {
    test('should create delays', async () => {
      const startTime = Date.now();
      await AsyncTestHelper.delay(100);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeWithinRange(90, 150); // Allow some variance
    });

    test('should wait for conditions', async () => {
      let counter = 0;
      const condition = () => {
        counter++;
        return counter >= 3;
      };

      const startTime = Date.now();
      await AsyncTestHelper.waitFor(condition, 1000, 50);
      const endTime = Date.now();

      expect(counter).toBe(3);
      expect(endTime - startTime).toBeWithinRange(100, 200); // ~150ms for 3 checks
    });

    test('should timeout when condition is not met', async () => {
      const condition = () => false; // Never true

      await expect(AsyncTestHelper.waitFor(condition, 200, 50))
        .rejects
        .toThrow('Condition not met within 200ms');
    });

    test('should race promises with timeout', async () => {
      const fastPromise = AsyncTestHelper.delay(50).then(() => 'fast');
      const slowPromise = AsyncTestHelper.delay(200).then(() => 'slow');

      const result = await AsyncTestHelper.raceWithTimeout(fastPromise, 100);
      expect(result).toBe('fast');

      await expect(AsyncTestHelper.raceWithTimeout(slowPromise, 100))
        .rejects
        .toThrow('Timeout after 100ms');
    });
  });

  describe('Integration Tests - Complete Service Workflow', () => {
    test('should complete full authentication and file analysis workflow', async () => {
      // Step 1: Login
      const loginResponse = await mockApiService.request('POST', '/auth/login', {
        email: 'valid@test.com',
        password: 'password',
      });
      
      expect(loginResponse.data.token).toBeDefined();
      mockApiService.setToken(loginResponse.data.token);

      // Step 2: Upload file for analysis
      const file = MockDataGenerator.createMockFile();
      const analysisResult = await analysisService.analyzeFile(file, 'deepfake');
      
      expect(analysisResult.success).toBe(true);
      
      // Step 3: Get all analyses
      const allAnalyses = await analysisService.getAllAnalyses();
      expect(Array.isArray(allAnalyses)).toBe(true);

      // Step 4: Store session in localStorage
      storageHelper.setItem('authToken', loginResponse.data.token);
      storageHelper.setItem('currentUser', loginResponse.data.user);
      
      expect(storageHelper.getItem('authToken')).toBe(loginResponse.data.token);
    });

    test('should handle service errors and recovery', async () => {
      // Test network error handling
      jest.spyOn(mockApiService, 'request').mockRejectedValueOnce(
        ErrorTestHelper.createNetworkError()
      );

      await expect(analysisService.getAllAnalyses())
        .rejects
        .toThrow('Network Error');

      // Test recovery
      jest.spyOn(mockApiService, 'request').mockResolvedValueOnce({
        data: { data: detectionFixture.sampleAnalyses },
        status: 200,
      });

      const analyses = await analysisService.getAllAnalyses();
      expect(Array.isArray(analyses)).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    test('should validate files quickly', () => {
      const file = MockDataGenerator.createMockFile();
      const startTime = performance.now();
      
      const result = fileValidator.validateFile(file);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeWithinRange(0, 10); // Should be very fast
      expect(result.isValid).toBeDefined();
    });

    test('should handle storage operations efficiently', () => {
      const largeObject = {
        analyses: Array(1000).fill(null).map((_, i) => ({
          id: i,
          data: `analysis-${i}`,
        })),
      };

      const startTime = performance.now();
      storageHelper.setItem('largeData', largeObject);
      const retrieved = storageHelper.getItem('largeData');
      const endTime = performance.now();

      expect(endTime - startTime).toBeWithinRange(0, 100); // Should complete quickly
      expect(retrieved.analyses.length).toBe(1000);
    });
  });
});
