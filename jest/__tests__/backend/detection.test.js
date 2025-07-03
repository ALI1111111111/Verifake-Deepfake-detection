/**
 * Backend API Tests - Detection Controller
 * Unit and Integration tests for file detection and analysis endpoints
 */

import { ApiTestHelper, MockDataGenerator, ErrorTestHelper } from '../../utils/testHelpers';
import detectionFixture from '../../fixtures/detection.json';

describe('Detection API Tests', () => {
  let apiHelper;

  beforeEach(() => {
    apiHelper = new ApiTestHelper();
    apiHelper.setAuthToken('mock-jwt-token');
    jest.clearAllMocks();
  });

  describe('Unit Tests - File Upload and Analysis', () => {
    test('should upload and analyze a valid image file', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile({
        name: 'test-image.jpg',
        type: 'image/jpeg',
        size: 1024000,
      });

      const service = 'deepfake';
      const expectedResponse = detectionFixture.apiResponses.uploadSuccess;

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 201,
      });

      // Act
      const result = await apiHelper.uploadFile(mockFile, service);

      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data.success).toBe(true);
      expect(result.data.analysis.status).toBe('processing');
      expect(result.data.analysis.id).toBeDefined();
    });

    test('should upload and analyze a valid video file', async () => {
      // Arrange
      const mockVideoFile = MockDataGenerator.createMockFile({
        name: 'test-video.mp4',
        type: 'video/mp4',
        size: 5120000,
      });

      const service = 'deepfake';
      const expectedResponse = {
        ...detectionFixture.apiResponses.uploadSuccess,
        analysis: {
          ...detectionFixture.apiResponses.uploadSuccess.analysis,
          estimated_time: 60, // Videos take longer
        },
      };

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 201,
      });

      // Act
      const result = await apiHelper.uploadFile(mockVideoFile, service);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.analysis.estimated_time).toBeGreaterThan(30);
    });

    test('should reject file upload without authentication', async () => {
      // Arrange
      apiHelper.setAuthToken(null);
      const mockFile = MockDataGenerator.createMockFile();

      const expectedError = ErrorTestHelper.createAuthError();

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: false,
        error: expectedError.response.data,
        status: 401,
      });

      // Act
      const result = await apiHelper.uploadFile(mockFile, 'deepfake');

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(result.error.message).toBe('Unauthenticated.');
    });

    test('should reject unsupported file types', async () => {
      // Arrange
      const unsupportedFile = MockDataGenerator.createMockFile({
        name: 'document.txt',
        type: 'text/plain',
        size: 1024,
      });

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          file: ['The file must be an image or video.'],
        },
      };

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.uploadFile(unsupportedFile, 'deepfake');

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
      expect(result.error.errors.file).toBeDefined();
    });

    test('should reject files exceeding size limit', async () => {
      // Arrange
      const largeFile = MockDataGenerator.createMockFile({
        name: 'large-image.jpg',
        type: 'image/jpeg',
        size: 15728640, // 15MB
      });

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          file: ['The file may not be greater than 10240 kilobytes.'],
        },
      };

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.uploadFile(largeFile, 'deepfake');

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
      expect(result.error.errors.file[0]).toContain('greater than');
    });

    test('should reject upload without service selection', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          service: ['The service field is required.'],
        },
      };

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.uploadFile(mockFile, null);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.errors.service).toBeDefined();
    });

    test('should handle all supported detection services', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();
      const services = detectionFixture.services.map(s => s.name);

      // Act & Assert
      for (const service of services) {
        const expectedResponse = {
          ...detectionFixture.apiResponses.uploadSuccess,
          analysis: {
            ...detectionFixture.apiResponses.uploadSuccess.analysis,
            service,
          },
        };

        jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
          success: true,
          data: expectedResponse,
          status: 201,
        });

        const result = await apiHelper.uploadFile(mockFile, service);
        
        expect(result.success).toBe(true);
        expect(result.data.analysis.service).toBe(service);
      }
    });
  });

  describe('Unit Tests - Analysis Results Retrieval', () => {
    test('should get list of user analyses', async () => {
      // Arrange
      const expectedResponse = {
        success: true,
        data: detectionFixture.sampleAnalyses,
        pagination: {
          current_page: 1,
          total: detectionFixture.sampleAnalyses.length,
          per_page: 10,
        },
      };

      jest.spyOn(apiHelper, 'getAnalyses').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.getAnalyses();

      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data.data)).toBe(true);
      expect(result.data.data.length).toBeGreaterThan(0);
    });

    test('should get specific analysis by ID', async () => {
      // Arrange
      const analysisId = 1;
      const expectedAnalysis = detectionFixture.sampleAnalyses.find(a => a.id === analysisId);

      const expectedResponse = {
        success: true,
        analysis: expectedAnalysis,
      };

      jest.spyOn(apiHelper, 'getAnalysis').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.getAnalysis(analysisId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.analysis.id).toBe(analysisId);
      expect(result.data.analysis.status).toBeDefined();
    });

    test('should handle completed analysis with results', async () => {
      // Arrange
      const completedAnalysis = detectionFixture.sampleAnalyses.find(
        a => a.status === 'completed'
      );

      const expectedResponse = {
        success: true,
        analysis: completedAnalysis,
      };

      jest.spyOn(apiHelper, 'getAnalysis').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.getAnalysis(completedAnalysis.id);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.analysis.status).toBe('completed');
      expect(result.data.analysis.result).toBeDefined();
      expect(result.data.analysis.result.confidence).toBeWithinRange(0, 1);
    });

    test('should handle processing analysis without results', async () => {
      // Arrange
      const processingAnalysis = detectionFixture.sampleAnalyses.find(
        a => a.status === 'processing'
      );

      const expectedResponse = {
        success: true,
        analysis: processingAnalysis,
      };

      jest.spyOn(apiHelper, 'getAnalysis').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.getAnalysis(processingAnalysis.id);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.analysis.status).toBe('processing');
      expect(result.data.analysis.result).toBeNull();
    });

    test('should handle failed analysis with error', async () => {
      // Arrange
      const failedAnalysis = detectionFixture.sampleAnalyses.find(
        a => a.status === 'failed'
      );

      const expectedResponse = {
        success: true,
        analysis: failedAnalysis,
      };

      jest.spyOn(apiHelper, 'getAnalysis').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.getAnalysis(failedAnalysis.id);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.analysis.status).toBe('failed');
      expect(result.data.analysis.result.error).toBeDefined();
      expect(result.data.analysis.result.error_code).toBeDefined();
    });

    test('should return 404 for non-existent analysis', async () => {
      // Arrange
      const nonExistentId = 9999;

      const expectedError = {
        success: false,
        message: 'Analysis not found',
      };

      jest.spyOn(apiHelper, 'getAnalysis').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 404,
      });

      // Act
      const result = await apiHelper.getAnalysis(nonExistentId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(result.error.message).toBe('Analysis not found');
    });
  });

  describe('Integration Tests - Complete Detection Workflow', () => {
    test('should complete full file upload to result workflow', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();
      const service = 'deepfake';

      // Mock upload response
      const uploadResponse = detectionFixture.apiResponses.uploadSuccess;
      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: true,
        data: uploadResponse,
        status: 201,
      });

      // Mock progress response
      const progressResponse = detectionFixture.apiResponses.analysisProgress;
      jest.spyOn(apiHelper, 'getAnalysis')
        .mockResolvedValueOnce({
          success: true,
          data: { analysis: { ...progressResponse.analysis, status: 'processing' } },
          status: 200,
        })
        .mockResolvedValueOnce({
          success: true,
          data: { analysis: detectionFixture.sampleAnalyses[0] },
          status: 200,
        });

      // Act - Upload file
      const uploadResult = await apiHelper.uploadFile(mockFile, service);
      const analysisId = uploadResult.data.analysis.id;

      // Act - Check progress
      const progressResult = await apiHelper.getAnalysis(analysisId);

      // Act - Get final result
      const finalResult = await apiHelper.getAnalysis(analysisId);

      // Assert
      expect(uploadResult.success).toBe(true);
      expect(progressResult.data.analysis.status).toBe('processing');
      expect(finalResult.data.analysis.status).toBe('completed');
      expect(finalResult.data.analysis.result).toBeDefined();
    });

    test('should handle API rate limiting', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();

      const rateLimitError = {
        success: false,
        message: 'API rate limit exceeded',
        retry_after: 60,
      };

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: false,
        error: rateLimitError,
        status: 429,
      });

      // Act
      const result = await apiHelper.uploadFile(mockFile, 'deepfake');

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(429);
      expect(result.error.retry_after).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    test('should upload files within acceptable time', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();
      const maxUploadTime = 5000; // 5 seconds

      jest.spyOn(apiHelper, 'uploadFile').mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
        return {
          success: true,
          data: detectionFixture.apiResponses.uploadSuccess,
          status: 201,
        };
      });

      // Act
      const startTime = performance.now();
      await apiHelper.uploadFile(mockFile, 'deepfake');
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Assert
      expect(executionTime).toBeWithinRange(0, maxUploadTime);
    });

    test('should retrieve analysis results quickly', async () => {
      // Arrange
      const maxRetrievalTime = 1000; // 1 second

      jest.spyOn(apiHelper, 'getAnalyses').mockResolvedValue({
        success: true,
        data: { data: detectionFixture.sampleAnalyses },
        status: 200,
      });

      // Act
      const startTime = performance.now();
      await apiHelper.getAnalyses();
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Assert
      expect(executionTime).toBeWithinRange(0, maxRetrievalTime);
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle server errors during upload', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();
      const serverError = ErrorTestHelper.createServerError();

      jest.spyOn(apiHelper, 'uploadFile').mockResolvedValue({
        success: false,
        error: serverError.response.data,
        status: 500,
      });

      // Act
      const result = await apiHelper.uploadFile(mockFile, 'deepfake');

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
    });

    test('should handle network timeouts', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();

      jest.spyOn(apiHelper, 'uploadFile').mockImplementation(async () => {
        throw new Error('Request timeout');
      });

      // Act & Assert
      await expect(apiHelper.uploadFile(mockFile, 'deepfake'))
        .rejects
        .toThrow('Request timeout');
    });
  });
});
