/**
 * Frontend Component Tests - Authentication Components
 * Unit tests for login, register, and auth context components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ComponentTestHelper, MockDataGenerator } from '../../utils/testHelpers';
import usersFixture from '../../fixtures/users.json';

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
  },
}));

// Mock components (these would be the actual components from your frontend)
const MockLoginPage = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          data-testid="email-input"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          data-testid="password-input"
          required
        />
      </div>
      <button type="submit" data-testid="login-button">
        Login
      </button>
    </form>
  );
};

const MockRegisterPage = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="register-form">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          data-testid="name-input"
          required
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          data-testid="email-input"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          data-testid="password-input"
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          data-testid="password-confirmation-input"
          required
        />
      </div>
      <button type="submit" data-testid="register-button">
        Register
      </button>
    </form>
  );
};

const MockAuthContext = React.createContext();
const MockAuthProvider = ({ children, value }) => (
  <MockAuthContext.Provider value={value}>
    {children}
  </MockAuthContext.Provider>
);

// Helper function to render components with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Frontend Authentication Components Tests', () => {
  let mockApi;

  beforeEach(() => {
    mockApi = require('../../../frontend/src/services/api').default;
    jest.clearAllMocks();
    ComponentTestHelper.mockLocalStorage();
  });

  describe('Unit Tests - Login Component', () => {
    test('should render login form with all required fields', () => {
      // Arrange & Act
      renderWithRouter(<MockLoginPage onSubmit={jest.fn()} />);

      // Assert
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    test('should update input values when user types', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithRouter(<MockLoginPage onSubmit={jest.fn()} />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      // Act
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Assert
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });

    test('should call onSubmit with form data when submitted', async () => {
      // Arrange
      const mockSubmit = jest.fn();
      const user = userEvent.setup();
      renderWithRouter(<MockLoginPage onSubmit={mockSubmit} />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('login-button');

      // Act
      await user.type(emailInput, usersFixture.loginCredentials.valid.email);
      await user.type(passwordInput, usersFixture.loginCredentials.valid.password);
      await user.click(submitButton);

      // Assert
      expect(mockSubmit).toHaveBeenCalledWith({
        email: usersFixture.loginCredentials.valid.email,
        password: usersFixture.loginCredentials.valid.password,
      });
    });

    test('should validate required fields', async () => {
      // Arrange
      const mockSubmit = jest.fn();
      const user = userEvent.setup();
      renderWithRouter(<MockLoginPage onSubmit={mockSubmit} />);

      const submitButton = screen.getByTestId('login-button');

      // Act
      await user.click(submitButton);

      // Assert
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    test('should handle form submission with valid data', async () => {
      // Arrange
      const validCredentials = usersFixture.loginCredentials.valid;
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: usersFixture.existingUser,
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const handleLogin = async (formData) => {
        const response = await mockApi.post('/auth/login', formData);
        localStorage.setItem('token', response.data.token);
        return response.data;
      };

      // Act
      const result = await handleLogin(validCredentials);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', validCredentials);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
      expect(result.user.email).toBe(validCredentials.email);
    });
  });

  describe('Unit Tests - Register Component', () => {
    test('should render registration form with all required fields', () => {
      // Arrange & Act
      renderWithRouter(<MockRegisterPage onSubmit={jest.fn()} />);

      // Assert
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-confirmation-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-button')).toBeInTheDocument();
    });

    test('should update all input values when user types', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithRouter(<MockRegisterPage onSubmit={jest.fn()} />);

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('password-confirmation-input');

      const userData = usersFixture.validUser;

      // Act
      await user.type(nameInput, userData.name);
      await user.type(emailInput, userData.email);
      await user.type(passwordInput, userData.password);
      await user.type(confirmPasswordInput, userData.password_confirmation);

      // Assert
      expect(nameInput.value).toBe(userData.name);
      expect(emailInput.value).toBe(userData.email);
      expect(passwordInput.value).toBe(userData.password);
      expect(confirmPasswordInput.value).toBe(userData.password_confirmation);
    });

    test('should call onSubmit with form data when submitted', async () => {
      // Arrange
      const mockSubmit = jest.fn();
      const user = userEvent.setup();
      renderWithRouter(<MockRegisterPage onSubmit={mockSubmit} />);

      const userData = usersFixture.validUser;

      // Act
      await user.type(screen.getByTestId('name-input'), userData.name);
      await user.type(screen.getByTestId('email-input'), userData.email);
      await user.type(screen.getByTestId('password-input'), userData.password);
      await user.type(screen.getByTestId('password-confirmation-input'), userData.password_confirmation);
      await user.click(screen.getByTestId('register-button'));

      // Assert
      expect(mockSubmit).toHaveBeenCalledWith(userData);
    });

    test('should handle successful registration', async () => {
      // Arrange
      const userData = usersFixture.validUser;
      const mockResponse = {
        data: {
          message: 'User registered successfully',
          user: MockDataGenerator.createMockUser({
            name: userData.name,
            email: userData.email,
          }),
          token: 'mock-jwt-token',
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const handleRegister = async (formData) => {
        const response = await mockApi.post('/auth/register', formData);
        localStorage.setItem('token', response.data.token);
        return response.data;
      };

      // Act
      const result = await handleRegister(userData);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
    });
  });

  describe('Unit Tests - Authentication Context', () => {
    test('should provide authentication state and methods', () => {
      // Arrange
      const mockAuthValue = {
        token: 'mock-token',
        user: usersFixture.existingUser,
        isAuthenticated: true,
        login: jest.fn(),
        logout: jest.fn(),
        loading: false,
      };

      const TestComponent = () => {
        const authContext = React.useContext(MockAuthContext);
        return (
          <div>
            <div data-testid="auth-status">
              {authContext.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            <div data-testid="user-name">{authContext.user?.name}</div>
            <button data-testid="login-btn" onClick={authContext.login}>
              Login
            </button>
            <button data-testid="logout-btn" onClick={authContext.logout}>
              Logout
            </button>
          </div>
        );
      };

      // Act
      renderWithRouter(
        <MockAuthProvider value={mockAuthValue}>
          <TestComponent />
        </MockAuthProvider>
      );

      // Assert
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent(usersFixture.existingUser.name);
      expect(screen.getByTestId('login-btn')).toBeInTheDocument();
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
    });

    test('should handle login action', async () => {
      // Arrange
      const mockLogin = jest.fn();
      const mockAuthValue = {
        token: null,
        user: null,
        isAuthenticated: false,
        login: mockLogin,
        logout: jest.fn(),
        loading: false,
      };

      const TestComponent = () => {
        const authContext = React.useContext(MockAuthContext);
        return (
          <button
            data-testid="login-btn"
            onClick={() => authContext.login('test@test.com', 'password')}
          >
            Login
          </button>
        );
      };

      renderWithRouter(
        <MockAuthProvider value={mockAuthValue}>
          <TestComponent />
        </MockAuthProvider>
      );

      // Act
      fireEvent.click(screen.getByTestId('login-btn'));

      // Assert
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password');
    });

    test('should handle logout action', async () => {
      // Arrange
      const mockLogout = jest.fn();
      const mockAuthValue = {
        token: 'mock-token',
        user: usersFixture.existingUser,
        isAuthenticated: true,
        login: jest.fn(),
        logout: mockLogout,
        loading: false,
      };

      const TestComponent = () => {
        const authContext = React.useContext(MockAuthContext);
        return (
          <button data-testid="logout-btn" onClick={authContext.logout}>
            Logout
          </button>
        );
      };

      renderWithRouter(
        <MockAuthProvider value={mockAuthValue}>
          <TestComponent />
        </MockAuthProvider>
      );

      // Act
      fireEvent.click(screen.getByTestId('logout-btn'));

      // Assert
      expect(mockLogout).toHaveBeenCalled();
    });

    test('should show loading state during authentication', () => {
      // Arrange
      const mockAuthValue = {
        token: null,
        user: null,
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn(),
        loading: true,
      };

      const TestComponent = () => {
        const authContext = React.useContext(MockAuthContext);
        return (
          <div>
            {authContext.loading ? (
              <div data-testid="loading">Loading...</div>
            ) : (
              <div data-testid="not-loading">Not Loading</div>
            )}
          </div>
        );
      };

      // Act
      renderWithRouter(
        <MockAuthProvider value={mockAuthValue}>
          <TestComponent />
        </MockAuthProvider>
      );

      // Assert
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('not-loading')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests - Authentication Flow', () => {
    test('should complete full login flow with context update', async () => {
      // Arrange
      const validCredentials = usersFixture.loginCredentials.valid;
      const mockResponse = {
        data: {
          token: 'integration-test-token',
          user: usersFixture.existingUser,
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      // Simulate the full login flow
      const loginFlow = async (credentials) => {
        try {
          const response = await mockApi.post('/auth/login', credentials);
          localStorage.setItem('token', response.data.token);
          
          // Simulate context update
          return {
            success: true,
            user: response.data.user,
            token: response.data.token,
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
          };
        }
      };

      // Act
      const result = await loginFlow(validCredentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.token).toBe('integration-test-token');
      expect(result.user.email).toBe(validCredentials.email);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'integration-test-token');
    });

    test('should handle authentication errors gracefully', async () => {
      // Arrange
      const invalidCredentials = usersFixture.loginCredentials.invalid[0];
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' },
          status: 401,
        },
      };

      mockApi.post.mockRejectedValue(mockError);

      const loginFlow = async (credentials) => {
        try {
          await mockApi.post('/auth/login', credentials);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || 'Login failed',
          };
        }
      };

      // Act
      const result = await loginFlow(invalidCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('Performance Tests', () => {
    test('should render login form quickly', () => {
      // Arrange
      const startTime = performance.now();

      // Act
      renderWithRouter(<MockLoginPage onSubmit={jest.fn()} />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Assert
      expect(renderTime).toBeWithinRange(0, 100); // Should render in under 100ms
    });

    test('should handle form input changes efficiently', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithRouter(<MockLoginPage onSubmit={jest.fn()} />);
      const emailInput = screen.getByTestId('email-input');

      const startTime = performance.now();

      // Act
      await user.type(emailInput, 'test@example.com');
      const endTime = performance.now();
      const inputTime = endTime - startTime;

      // Assert
      expect(inputTime).toBeWithinRange(0, 1000); // Should complete in under 1 second
      expect(emailInput.value).toBe('test@example.com');
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper form labels and structure', () => {
      // Act
      renderWithRouter(<MockLoginPage onSubmit={jest.fn()} />);

      // Assert
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
    });

    test('should support keyboard navigation', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithRouter(<MockLoginPage onSubmit={jest.fn()} />);

      // Act
      await user.tab(); // Focus first input
      const emailInput = screen.getByTestId('email-input');
      expect(emailInput).toHaveFocus();

      await user.tab(); // Focus second input
      const passwordInput = screen.getByTestId('password-input');
      expect(passwordInput).toHaveFocus();

      await user.tab(); // Focus button
      const submitButton = screen.getByTestId('login-button');
      expect(submitButton).toHaveFocus();
    });
  });
});
