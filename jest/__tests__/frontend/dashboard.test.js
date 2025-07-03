/**
 * Frontend Component Tests - Dashboard and File Upload Components
 * Unit tests for file upload, analysis, and dashboard functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ComponentTestHelper, MockDataGenerator } from '../../utils/testHelpers';
import detectionFixture from '../../fixtures/detection.json';

// Mock the API service
jest.mock('../../../frontend/src/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock Dashboard Component
const MockDashboard = ({ onFileUpload, analysisResults = [] }) => {
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [selectedService, setSelectedService] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0 || !selectedService) return;

    setIsUploading(true);
    try {
      await onFileUpload(selectedFiles[0], selectedService);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div data-testid="dashboard">
      <h1>Dashboard</h1>
      
      {/* File Upload Section */}
      <form onSubmit={handleSubmit} data-testid="upload-form">
        <div
          data-testid="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ border: '2px dashed #ccc', padding: '20px', margin: '10px 0' }}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            data-testid="file-input"
            multiple
          />
          <p>Drag and drop files here or click to select</p>
        </div>

        {/* Service Selection */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          data-testid="service-select"
          required
        >
          <option value="">Select Detection Service</option>
          {detectionFixture.services.map((service) => (
            <option key={service.name} value={service.name}>
              {service.label}
            </option>
          ))}
        </select>

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div data-testid="selected-files">
            <h3>Selected Files:</h3>
            {selectedFiles.map((file, index) => (
              <div key={index} data-testid={`file-${index}`}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={selectedFiles.length === 0 || !selectedService || isUploading}
          data-testid="upload-button"
        >
          {isUploading ? 'Uploading...' : 'Analyze File'}
        </button>
      </form>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div data-testid="analysis-results">
          <h2>Recent Analyses</h2>
          {analysisResults.map((analysis) => (
            <div key={analysis.id} data-testid={`analysis-${analysis.id}`}>
              <div>File: {analysis.file_name}</div>
              <div>Service: {analysis.service}</div>
              <div>Status: {analysis.status}</div>
              {analysis.result && (
                <div data-testid={`result-${analysis.id}`}>
                  Result: {JSON.stringify(analysis.result)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock File Upload Component
const MockFileUpload = ({ onUpload, isUploading = false, allowedTypes = ['image/*', 'video/*'] }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onUpload(file);
    }
  };

  return (
    <div
      data-testid="file-upload"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? '2px solid blue' : '2px dashed gray',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        data-testid="file-input"
        disabled={isUploading}
      />
      
      {isUploading && <div data-testid="upload-progress">Uploading...</div>}
      
      {selectedFile && (
        <div data-testid="selected-file-info">
          <p>Selected: {selectedFile.name}</p>
          <p>Size: {Math.round(selectedFile.size / 1024)} KB</p>
          <p>Type: {selectedFile.type}</p>
        </div>
      )}
    </div>
  );
};

// Mock Analysis Progress Component
const MockAnalysisProgress = ({ analysis, onRefresh }) => {
  React.useEffect(() => {
    if (analysis?.status === 'processing') {
      const interval = setInterval(() => {
        onRefresh && onRefresh(analysis.id);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [analysis, onRefresh]);

  if (!analysis) return null;

  return (
    <div data-testid="analysis-progress">
      <h3>Analysis Progress</h3>
      <div data-testid="analysis-id">ID: {analysis.id}</div>
      <div data-testid="analysis-status">Status: {analysis.status}</div>
      
      {analysis.status === 'processing' && (
        <div data-testid="progress-indicator">
          <div>Processing...</div>
          {analysis.progress && (
            <div data-testid="progress-percentage">{analysis.progress}%</div>
          )}
        </div>
      )}
      
      {analysis.status === 'completed' && analysis.result && (
        <div data-testid="analysis-result">
          <div>Confidence: {analysis.result.confidence}</div>
          <div>Prediction: {analysis.result.prediction}</div>
        </div>
      )}
      
      {analysis.status === 'failed' && (
        <div data-testid="analysis-error">
          Error: {analysis.result?.error || 'Analysis failed'}
        </div>
      )}
    </div>
  );
};

// Helper function to render components with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Frontend Dashboard and File Upload Tests', () => {
  let mockApi;

  beforeEach(() => {
    mockApi = require('../../../frontend/src/services/api').default;
    jest.clearAllMocks();
    ComponentTestHelper.mockLocalStorage();
  });

  describe('Unit Tests - Dashboard Component', () => {
    test('should render dashboard with upload form', () => {
      // Arrange & Act
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);

      // Assert
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('upload-form')).toBeInTheDocument();
      expect(screen.getByTestId('file-input')).toBeInTheDocument();
      expect(screen.getByTestId('service-select')).toBeInTheDocument();
      expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });

    test('should display all available detection services', () => {
      // Arrange & Act
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);
      
      const serviceSelect = screen.getByTestId('service-select');

      // Assert
      detectionFixture.services.forEach((service) => {
        expect(serviceSelect).toHaveTextContent(service.label);
      });
    });

    test('should handle file selection through input', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockFile = MockDataGenerator.createMockFile();
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);

      const fileInput = screen.getByTestId('file-input');

      // Act
      await user.upload(fileInput, mockFile);

      // Assert
      expect(screen.getByTestId('selected-files')).toBeInTheDocument();
      expect(screen.getByTestId('file-0')).toHaveTextContent(mockFile.name);
    });

    test('should handle service selection', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);

      const serviceSelect = screen.getByTestId('service-select');

      // Act
      await user.selectOptions(serviceSelect, 'deepfake');

      // Assert
      expect(serviceSelect.value).toBe('deepfake');
    });

    test('should disable upload button when no file or service selected', () => {
      // Arrange & Act
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);

      const uploadButton = screen.getByTestId('upload-button');

      // Assert
      expect(uploadButton).toBeDisabled();
    });

    test('should enable upload button when file and service are selected', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockFile = MockDataGenerator.createMockFile();
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);

      const fileInput = screen.getByTestId('file-input');
      const serviceSelect = screen.getByTestId('service-select');
      const uploadButton = screen.getByTestId('upload-button');

      // Act
      await user.upload(fileInput, mockFile);
      await user.selectOptions(serviceSelect, 'deepfake');

      // Assert
      expect(uploadButton).not.toBeDisabled();
    });

    test('should call onFileUpload when form is submitted', async () => {
      // Arrange
      const mockUpload = jest.fn().mockResolvedValue({});
      const user = userEvent.setup();
      const mockFile = MockDataGenerator.createMockFile();
      
      renderWithRouter(<MockDashboard onFileUpload={mockUpload} />);

      const fileInput = screen.getByTestId('file-input');
      const serviceSelect = screen.getByTestId('service-select');
      const uploadButton = screen.getByTestId('upload-button');

      // Act
      await user.upload(fileInput, mockFile);
      await user.selectOptions(serviceSelect, 'deepfake');
      await user.click(uploadButton);

      // Assert
      expect(mockUpload).toHaveBeenCalledWith(mockFile, 'deepfake');
    });

    test('should display analysis results when provided', () => {
      // Arrange
      const mockResults = [detectionFixture.sampleAnalyses[0]];
      
      // Act
      renderWithRouter(
        <MockDashboard onFileUpload={jest.fn()} analysisResults={mockResults} />
      );

      // Assert
      expect(screen.getByTestId('analysis-results')).toBeInTheDocument();
      expect(screen.getByTestId('analysis-1')).toBeInTheDocument();
      expect(screen.getByTestId('result-1')).toBeInTheDocument();
    });
  });

  describe('Unit Tests - File Upload Component', () => {
    test('should render file upload component', () => {
      // Arrange & Act
      renderWithRouter(<MockFileUpload onUpload={jest.fn()} />);

      // Assert
      expect(screen.getByTestId('file-upload')).toBeInTheDocument();
      expect(screen.getByTestId('file-input')).toBeInTheDocument();
    });

    test('should handle file selection', async () => {
      // Arrange
      const mockUpload = jest.fn();
      const user = userEvent.setup();
      const mockFile = MockDataGenerator.createMockFile();
      
      renderWithRouter(<MockFileUpload onUpload={mockUpload} />);

      const fileInput = screen.getByTestId('file-input');

      // Act
      await user.upload(fileInput, mockFile);

      // Assert
      expect(mockUpload).toHaveBeenCalledWith(mockFile);
      expect(screen.getByTestId('selected-file-info')).toBeInTheDocument();
    });

    test('should display file information after selection', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockFile = MockDataGenerator.createMockFile({
        name: 'test-image.jpg',
        size: 2048000, // 2MB
        type: 'image/jpeg',
      });
      
      renderWithRouter(<MockFileUpload onUpload={jest.fn()} />);

      const fileInput = screen.getByTestId('file-input');

      // Act
      await user.upload(fileInput, mockFile);

      // Assert
      const fileInfo = screen.getByTestId('selected-file-info');
      expect(fileInfo).toHaveTextContent('test-image.jpg');
      expect(fileInfo).toHaveTextContent('2000 KB');
      expect(fileInfo).toHaveTextContent('image/jpeg');
    });

    test('should show uploading state', () => {
      // Arrange & Act
      renderWithRouter(<MockFileUpload onUpload={jest.fn()} isUploading={true} />);

      // Assert
      expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
      expect(screen.getByTestId('file-input')).toBeDisabled();
    });

    test('should handle drag and drop', () => {
      // Arrange
      const mockUpload = jest.fn();
      const mockFile = MockDataGenerator.createMockFile();
      
      renderWithRouter(<MockFileUpload onUpload={mockUpload} />);

      const dropzone = screen.getByTestId('file-upload');

      // Act
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [mockFile],
        },
      });

      // Assert
      expect(mockUpload).toHaveBeenCalledWith(mockFile);
    });

    test('should change appearance when dragging over', () => {
      // Arrange
      renderWithRouter(<MockFileUpload onUpload={jest.fn()} />);
      const dropzone = screen.getByTestId('file-upload');

      // Act
      fireEvent.dragEnter(dropzone);

      // Assert
      expect(dropzone.style.border).toContain('blue');
    });
  });

  describe('Unit Tests - Analysis Progress Component', () => {
    test('should display analysis information', () => {
      // Arrange
      const mockAnalysis = detectionFixture.sampleAnalyses[0];
      
      // Act
      renderWithRouter(
        <MockAnalysisProgress analysis={mockAnalysis} onRefresh={jest.fn()} />
      );

      // Assert
      expect(screen.getByTestId('analysis-progress')).toBeInTheDocument();
      expect(screen.getByTestId('analysis-id')).toHaveTextContent('1');
      expect(screen.getByTestId('analysis-status')).toHaveTextContent('completed');
    });

    test('should show progress indicator for processing analysis', () => {
      // Arrange
      const processingAnalysis = {
        ...detectionFixture.sampleAnalyses[2],
        progress: 45,
      };
      
      // Act
      renderWithRouter(
        <MockAnalysisProgress analysis={processingAnalysis} onRefresh={jest.fn()} />
      );

      // Assert
      expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('45%');
    });

    test('should display results for completed analysis', () => {
      // Arrange
      const completedAnalysis = detectionFixture.sampleAnalyses[0];
      
      // Act
      renderWithRouter(
        <MockAnalysisProgress analysis={completedAnalysis} onRefresh={jest.fn()} />
      );

      // Assert
      expect(screen.getByTestId('analysis-result')).toBeInTheDocument();
      expect(screen.getByText('Confidence: 0.85')).toBeInTheDocument();
      expect(screen.getByText('Prediction: real')).toBeInTheDocument();
    });

    test('should display error for failed analysis', () => {
      // Arrange
      const failedAnalysis = detectionFixture.sampleAnalyses[3];
      
      // Act
      renderWithRouter(
        <MockAnalysisProgress analysis={failedAnalysis} onRefresh={jest.fn()} />
      );

      // Assert
      expect(screen.getByTestId('analysis-error')).toBeInTheDocument();
      expect(screen.getByText(/File format not supported/)).toBeInTheDocument();
    });

    test('should call onRefresh for processing analysis', async () => {
      // Arrange
      const mockRefresh = jest.fn();
      const processingAnalysis = detectionFixture.sampleAnalyses[2];
      
      // Act
      renderWithRouter(
        <MockAnalysisProgress analysis={processingAnalysis} onRefresh={mockRefresh} />
      );

      // Wait for the interval to trigger
      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalledWith(processingAnalysis.id);
      }, { timeout: 3000 });
    });
  });

  describe('Integration Tests - File Upload to Analysis Flow', () => {
    test('should complete full upload and analysis workflow', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();
      const uploadResponse = detectionFixture.apiResponses.uploadSuccess;
      const completedAnalysis = detectionFixture.sampleAnalyses[0];

      mockApi.post.mockResolvedValue({ data: uploadResponse });
      mockApi.get.mockResolvedValue({ data: { analysis: completedAnalysis } });

      const handleUpload = async (file, service) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('service', service);
        
        const response = await mockApi.post('/detect', formData);
        return response.data;
      };

      // Act
      const result = await handleUpload(mockFile, 'deepfake');

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/detect', expect.any(FormData));
      expect(result.success).toBe(true);
      expect(result.analysis.status).toBe('processing');
    });

    test('should handle file validation errors', async () => {
      // Arrange
      const invalidFile = MockDataGenerator.createMockFile({
        name: 'document.txt',
        type: 'text/plain',
      });

      const validationError = {
        response: {
          data: {
            errors: {
              file: ['The file must be an image or video.'],
            },
          },
        },
      };

      mockApi.post.mockRejectedValue(validationError);

      const handleUpload = async (file, service) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('service', service);
          
          await mockApi.post('/detect', formData);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            errors: error.response?.data?.errors,
          };
        }
      };

      // Act
      const result = await handleUpload(invalidFile, 'deepfake');

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors.file[0]).toContain('image or video');
    });
  });

  describe('Performance Tests', () => {
    test('should render dashboard quickly', () => {
      // Arrange
      const startTime = performance.now();

      // Act
      renderWithRouter(<MockDashboard onFileUpload={jest.fn()} />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Assert
      expect(renderTime).toBeWithinRange(0, 200); // Should render in under 200ms
    });

    test('should handle large file lists efficiently', () => {
      // Arrange
      const largeResultsList = Array(100).fill(null).map((_, index) => ({
        ...detectionFixture.sampleAnalyses[0],
        id: index + 1,
        file_name: `file-${index + 1}.jpg`,
      }));

      const startTime = performance.now();

      // Act
      renderWithRouter(
        <MockDashboard onFileUpload={jest.fn()} analysisResults={largeResultsList} />
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Assert
      expect(renderTime).toBeWithinRange(0, 1000); // Should render 100 items in under 1 second
      expect(screen.getByTestId('analysis-results')).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle upload failures gracefully', async () => {
      // Arrange
      const mockFile = MockDataGenerator.createMockFile();
      const networkError = new Error('Network Error');
      
      const failingUpload = jest.fn().mockRejectedValue(networkError);
      const user = userEvent.setup();

      renderWithRouter(<MockDashboard onFileUpload={failingUpload} />);

      const fileInput = screen.getByTestId('file-input');
      const serviceSelect = screen.getByTestId('service-select');
      const uploadButton = screen.getByTestId('upload-button');

      // Act
      await user.upload(fileInput, mockFile);
      await user.selectOptions(serviceSelect, 'deepfake');
      await user.click(uploadButton);

      // Assert
      expect(failingUpload).toHaveBeenCalled();
      // Button should be re-enabled after error
      await waitFor(() => {
        expect(uploadButton).not.toBeDisabled();
      });
    });
  });
});
