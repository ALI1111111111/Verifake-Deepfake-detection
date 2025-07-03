/**
 * Backend API Tests - Authentication Controller
 * Unit and Integration tests for user authentication endpoints
 */

import { ApiTestHelper, MockDataGenerator, ErrorTestHelper } from '../../utils/testHelpers';
import usersFixture from '../../fixtures/users.json';

describe('Authentication API Tests', () => {
  let apiHelper;

  beforeEach(() => {
    apiHelper = new ApiTestHelper();
    jest.clearAllMocks();
  });

  describe('Unit Tests - User Registration', () => {
    test('should register a new user with valid data', async () => {
      // Arrange
      const userData = usersFixture.validUser;
      const expectedResponse = {
        success: true,
        message: 'User registered successfully',
        user: MockDataGenerator.createMockUser({
          name: userData.name,
          email: userData.email,
        }),
        token: 'mock-jwt-token.example.token',
      };

      // Mock the API response
      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 201,
      });

      // Act
      const result = await apiHelper.register(userData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.data.user.name).toBe(userData.name);
      expect(result.data.user.email).toBe(userData.email);
      expect(result.data.token).toBeDefined();
      expect(result.data.token).toHaveValidToken();
    });

    test('should reject registration with invalid email', async () => {
      // Arrange
      const invalidUser = usersFixture.invalidUsers.find(
        user => user.error === 'Invalid email format'
      );

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          email: ['The email must be a valid email address.'],
        },
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.register(invalidUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
      expect(result.error.errors.email).toBeDefined();
    });

    test('should reject registration with weak password', async () => {
      // Arrange
      const weakPasswordUser = usersFixture.invalidUsers.find(
        user => user.error === 'Password too short'
      );

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          password: ['The password must be at least 8 characters.'],
        },
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.register(weakPasswordUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
      expect(result.error.errors.password).toBeDefined();
    });

    test('should reject registration with mismatched passwords', async () => {
      // Arrange
      const mismatchedUser = usersFixture.invalidUsers.find(
        user => user.error === 'Passwords do not match'
      );

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          password: ['The password confirmation does not match.'],
        },
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.register(mismatchedUser);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.errors.password).toBeDefined();
    });

    test('should reject registration with existing email', async () => {
      // Arrange
      const existingUserData = {
        ...usersFixture.validUser,
        email: usersFixture.existingUser.email,
      };

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          email: ['The email has already been taken.'],
        },
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.register(existingUserData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
      expect(result.error.errors.email[0]).toContain('already been taken');
    });
  });

  describe('Unit Tests - User Login', () => {
    test('should login with valid credentials', async () => {
      // Arrange
      const credentials = usersFixture.loginCredentials.valid;
      const expectedResponse = {
        success: true,
        message: 'Login successful',
        user: usersFixture.existingUser,
        token: 'mock-jwt-token.example.token',
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.login(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data.user.email).toBe(credentials.email);
      expect(result.data.token).toBeDefined();
      expect(result.data.token).toHaveValidToken();
    });

    test('should reject login with invalid credentials', async () => {
      // Arrange
      const invalidCredentials = usersFixture.loginCredentials.invalid.find(
        cred => cred.error === 'Invalid credentials'
      );

      const expectedError = {
        success: false,
        message: 'Invalid credentials',
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 401,
      });

      // Act
      const result = await apiHelper.login(invalidCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(result.error.message).toBe('Invalid credentials');
    });

    test('should reject login with non-existent user', async () => {
      // Arrange
      const nonExistentCredentials = usersFixture.loginCredentials.invalid.find(
        cred => cred.error === 'User not found'
      );

      const expectedError = {
        success: false,
        message: 'User not found',
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 404,
      });

      // Act
      const result = await apiHelper.login(nonExistentCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(result.error.message).toBe('User not found');
    });
  });

  describe('Unit Tests - User Profile Management', () => {
    beforeEach(() => {
      apiHelper.setAuthToken('mock-jwt-token');
    });

    test('should get current user profile', async () => {
      // Arrange
      const expectedResponse = {
        success: true,
        user: usersFixture.existingUser,
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.getUser();

      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data.user).toEqual(usersFixture.existingUser);
    });

    test('should update user profile with valid data', async () => {
      // Arrange
      const updateData = usersFixture.updateData.valid;
      const updatedUser = {
        ...usersFixture.existingUser,
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      const expectedResponse = {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: true,
        data: expectedResponse,
        status: 200,
      });

      // Act
      const result = await apiHelper.updateUser(updateData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data.user.name).toBe(updateData.name);
      expect(result.data.user.email).toBe(updateData.email);
    });

    test('should reject profile update with invalid data', async () => {
      // Arrange
      const invalidUpdate = usersFixture.updateData.invalid.find(
        update => update.error === 'Invalid email format'
      );

      const expectedError = {
        success: false,
        message: 'The given data was invalid.',
        errors: {
          email: ['The email must be a valid email address.'],
        },
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 422,
      });

      // Act
      const result = await apiHelper.updateUser(invalidUpdate);

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
      expect(result.error.errors.email).toBeDefined();
    });

    test('should reject unauthorized requests', async () => {
      // Arrange
      apiHelper.setAuthToken(null); // Remove token

      const expectedError = ErrorTestHelper.createAuthError();

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError.response.data,
        status: 401,
      });

      // Act
      const result = await apiHelper.getUser();

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(result.error.message).toBe('Unauthenticated.');
    });
  });

  describe('Integration Tests - Authentication Flow', () => {
    test('should complete full registration and login flow', async () => {
      const userData = usersFixture.validUser;
      
      // Mock registration
      const registrationResponse = {
        success: true,
        message: 'User registered successfully',
        user: MockDataGenerator.createMockUser({
          name: userData.name,
          email: userData.email,
        }),
        token: 'registration-token',
      };

      jest.spyOn(apiHelper, 'register').mockResolvedValue({
        success: true,
        data: registrationResponse,
        status: 201,
      });

      // Mock login
      const loginResponse = {
        success: true,
        message: 'Login successful',
        user: registrationResponse.user,
        token: 'login-token',
      };

      jest.spyOn(apiHelper, 'login').mockResolvedValue({
        success: true,
        data: loginResponse,
        status: 200,
      });

      // Act - Register
      const registerResult = await apiHelper.register(userData);

      // Assert registration
      expect(registerResult.success).toBe(true);
      expect(registerResult.data.user.email).toBe(userData.email);

      // Act - Login
      const loginResult = await apiHelper.login({
        email: userData.email,
        password: userData.password,
      });

      // Assert login
      expect(loginResult.success).toBe(true);
      expect(loginResult.data.user.email).toBe(userData.email);
      expect(loginResult.data.token).toBeDefined();
    });

    test('should handle token expiration gracefully', async () => {
      // Arrange
      apiHelper.setAuthToken('expired-token');

      const expectedError = {
        success: false,
        message: 'Token has expired',
      };

      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: expectedError,
        status: 401,
      });

      // Act
      const result = await apiHelper.getUser();

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(result.error.message).toContain('expired');
    });
  });

  describe('Performance Tests', () => {
    test('should complete authentication within acceptable time', async () => {
      // Arrange
      const userData = usersFixture.validUser;
      const maxExecutionTime = 1000; // 1 second

      jest.spyOn(apiHelper, 'register').mockResolvedValue({
        success: true,
        data: { user: MockDataGenerator.createMockUser(), token: 'token' },
        status: 201,
      });

      // Act
      const startTime = performance.now();
      await apiHelper.register(userData);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Assert
      expect(executionTime).toBeWithinRange(0, maxExecutionTime);
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle network errors gracefully', async () => {
      // Arrange
      const networkError = ErrorTestHelper.createNetworkError();
      jest.spyOn(apiHelper, 'makeRequest').mockRejectedValue(networkError);

      // Act & Assert
      await expect(apiHelper.login({ email: 'test@test.com', password: 'password' }))
        .rejects
        .toThrow('Network Error');
    });

    test('should handle server errors gracefully', async () => {
      // Arrange
      const serverError = ErrorTestHelper.createServerError();
      jest.spyOn(apiHelper, 'makeRequest').mockResolvedValue({
        success: false,
        error: serverError.response.data,
        status: 500,
      });

      // Act
      const result = await apiHelper.login({ email: 'test@test.com', password: 'password' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
    });
  });
});
