#!/usr/bin/env node

/**
 * Jest Testing Help Guide
 * Comprehensive help and guidance for using the Jest test suite
 */

const fs = require('fs');
const path = require('path');

class JestHelpGuide {
    constructor() {
        this.commands = {
            basic: {
                'npm test': 'Run all tests once',
                'npm run test:watch': 'Run tests in watch mode (re-runs on file changes)',
                'npm run test:coverage': 'Run tests with coverage report',
                'npm run test:verbose': 'Run tests with detailed output',
                'npm run test:silent': 'Run tests with minimal output',
            },
            
            specific: {
                'npm run test:backend': 'Run only backend API tests',
                'npm run test:frontend': 'Run only frontend component tests',
                'npm run test:unit': 'Run only unit tests',
                'npm run test:integration': 'Run only integration tests',
                'npm run test:api': 'Run API-related tests',
                'npm run test:components': 'Run component tests',
                'npm run test:services': 'Run service tests',
                'npm run test:utils': 'Run utility tests',
            },
            
            advanced: {
                'npm run test:debug': 'Run tests in debug mode',
                'npm run lint': 'Check code quality of test files',
                'npm run setup': 'Re-run setup and health check',
                'npm run clean': 'Clean cache and reinstall dependencies',
            },
        };

        this.testPatterns = {
            'Running specific tests': {
                'jest auth': 'Run tests matching "auth"',
                'jest --testPathPattern=backend': 'Run tests in backend folder',
                'jest --testNamePattern="should login"': 'Run tests with specific name pattern',
                'jest auth.test.js': 'Run specific test file',
            },
            
            'Watch mode options': {
                'jest --watch': 'Watch for changes and re-run',
                'jest --watchAll': 'Watch all files',
                'jest --watch --verbose': 'Watch with detailed output',
                'jest --watch --coverage': 'Watch with coverage',
            },
            
            'Coverage options': {
                'jest --coverage': 'Generate coverage report',
                'jest --coverage --collectCoverageFrom="**/*.js"': 'Coverage for specific files',
                'jest --coverage --coverageReporters=html': 'HTML coverage report',
                'jest --coverage --coverageThreshold=\'{"global":{"lines":80}}\'': 'Set coverage threshold',
            },
        };

        this.testStructure = {
            '__tests__/backend/': 'Backend API tests (auth, detection, etc.)',
            '__tests__/frontend/': 'Frontend component tests (auth, dashboard, etc.)',
            'fixtures/': 'Test data files (users.json, detection.json)',
            'utils/': 'Test helper functions and utilities',
            '__mocks__/': 'Mock implementations for external dependencies',
            'coverage/': 'Coverage reports (generated after running with --coverage)',
            'jest.setup.js': 'Global test configuration and setup',
            'babel.config.js': 'Babel configuration for ES6/JSX support',
            'package.json': 'Jest configuration and npm scripts',
        };

        this.bestPractices = [
            'Write descriptive test names that explain what is being tested',
            'Use arrange-act-assert pattern in your tests',
            'Mock external dependencies to isolate units under test',
            'Test both happy path and error scenarios',
            'Keep tests independent - each test should be able to run alone',
            'Use beforeEach/afterEach for setup and cleanup',
            'Test user interactions, not implementation details',
            'Aim for high test coverage but focus on critical paths',
            'Use data-testid attributes for reliable element selection',
            'Group related tests with describe blocks',
        ];

        this.troubleshooting = {
            'Tests are failing': [
                'Check if all dependencies are installed (npm install)',
                'Verify server are running for integration tests',
                'Check console for detailed error messages',
                'Ensure test data matches expected format',
                'Verify mock implementations are correct',
            ],
            
            'Tests are slow': [
                'Use --runInBand for debugging',
                'Check for async operations without proper awaiting',
                'Reduce timeout values if appropriate',
                'Use mocks instead of real API calls',
                'Consider running specific test suites instead of all tests',
            ],
            
            'Coverage is low': [
                'Check which files are not covered',
                'Add tests for uncovered functions',
                'Remove dead code',
                'Test error handling paths',
                'Add integration tests for user workflows',
            ],
            
            'Setup issues': [
                'Run: npm run setup',
                'Check Node.js version (14+ required)',
                'Verify all required files exist',
                'Clear cache: npm run clean',
                'Reinstall dependencies: rm -rf node_modules && npm install',
            ],
        };
    }

    showHelp(topic = null) {
        if (topic) {
            this.showSpecificHelp(topic);
        } else {
            this.showGeneralHelp();
        }
    }

    showGeneralHelp() {
        console.log('🧪 Jest Testing Help Guide\n');
        console.log('Available help topics:');
        console.log('  node help.js commands       # Show all available commands');
        console.log('  node help.js patterns       # Show test execution patterns');
        console.log('  node help.js structure      # Show project structure');
        console.log('  node help.js practices      # Show testing best practices');
        console.log('  node help.js troubleshoot   # Show troubleshooting guide');
        console.log('  node help.js examples       # Show test examples');
        console.log('  node help.js quick          # Quick start guide\n');
        
        this.showQuickStart();
    }

    showSpecificHelp(topic) {
        switch (topic.toLowerCase()) {
            case 'commands':
                this.showCommands();
                break;
            case 'patterns':
                this.showPatterns();
                break;
            case 'structure':
                this.showStructure();
                break;
            case 'practices':
                this.showBestPractices();
                break;
            case 'troubleshoot':
                this.showTroubleshooting();
                break;
            case 'examples':
                this.showExamples();
                break;
            case 'quick':
                this.showQuickStart();
                break;
            default:
                console.log(`Unknown topic: ${topic}`);
                this.showGeneralHelp();
        }
    }

    showCommands() {
        console.log('📋 Available Commands\n');
        
        console.log('🟢 Basic Commands:');
        Object.entries(this.commands.basic).forEach(([cmd, desc]) => {
            console.log(`  ${cmd.padEnd(30)} # ${desc}`);
        });
        
        console.log('\n🟡 Specific Test Categories:');
        Object.entries(this.commands.specific).forEach(([cmd, desc]) => {
            console.log(`  ${cmd.padEnd(30)} # ${desc}`);
        });
        
        console.log('\n🟠 Advanced Commands:');
        Object.entries(this.commands.advanced).forEach(([cmd, desc]) => {
            console.log(`  ${cmd.padEnd(30)} # ${desc}`);
        });
    }

    showPatterns() {
        console.log('🎯 Test Execution Patterns\n');
        
        Object.entries(this.testPatterns).forEach(([category, patterns]) => {
            console.log(`📌 ${category}:`);
            Object.entries(patterns).forEach(([cmd, desc]) => {
                console.log(`  ${cmd.padEnd(40)} # ${desc}`);
            });
            console.log('');
        });
    }

    showStructure() {
        console.log('📁 Project Structure\n');
        
        Object.entries(this.testStructure).forEach(([path, desc]) => {
            const icon = path.endsWith('/') ? '📁' : '📄';
            console.log(`${icon} ${path.padEnd(25)} # ${desc}`);
        });
        
        console.log('\n📊 Test Coverage Structure:');
        console.log('coverage/');
        console.log('├── lcov-report/           # HTML coverage report');
        console.log('├── lcov.info             # Coverage data');
        console.log('└── coverage-summary.json # Coverage summary');
    }

    showBestPractices() {
        console.log('✨ Testing Best Practices\n');
        
        this.bestPractices.forEach((practice, index) => {
            console.log(`${index + 1}. ${practice}`);
        });
        
        console.log('\n📝 Test Writing Template:');
        console.log(`
describe('Component/Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  describe('Unit Tests - Feature Description', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });
});`);
    }

    showTroubleshooting() {
        console.log('🔧 Troubleshooting Guide\n');
        
        Object.entries(this.troubleshooting).forEach(([problem, solutions]) => {
            console.log(`❓ ${problem}:`);
            solutions.forEach(solution => {
                console.log(`   • ${solution}`);
            });
            console.log('');
        });
        
        console.log('🆘 Getting More Help:');
        console.log('   • Check Jest documentation: https://jestjs.io/docs/getting-started');
        console.log('   • React Testing Library: https://testing-library.com/docs/react-testing-library/intro/');
        console.log('   • Stack Overflow: Search for "jest" + your error message');
        console.log('   • GitHub Issues: Check the Jest GitHub repository');
    }

    showExamples() {
        console.log('💡 Test Examples\n');
        
        console.log('🔐 Authentication Test Example:');
        console.log(`
test('should login with valid credentials', async () => {
  // Arrange
  const credentials = { email: 'test@test.com', password: 'password' };
  const mockResponse = { token: 'jwt-token', user: { id: 1 } };
  mockApi.post.mockResolvedValue({ data: mockResponse });

  // Act
  const result = await loginUser(credentials);

  // Assert
  expect(mockApi.post).toHaveBeenCalledWith('/auth/login', credentials);
  expect(result.token).toBe('jwt-token');
});`);

        console.log('\n📄 Component Test Example:');
        console.log(`
test('should render login form', () => {
  // Arrange & Act
  render(<LoginForm onSubmit={jest.fn()} />);

  // Assert
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});`);

        console.log('\n🔄 API Test Example:');
        console.log(`
test('should upload file successfully', async () => {
  // Arrange
  const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
  const expectedResponse = { success: true, id: 1 };

  // Act
  const result = await apiService.uploadFile(file, 'deepfake');

  // Assert
  expect(result.success).toBe(true);
  expect(result.id).toBeDefined();
});`);
    }

    showQuickStart() {
        console.log('🚀 Quick Start Guide\n');
        
        console.log('1️⃣  First Time Setup:');
        console.log('   npm install              # Install dependencies');
        console.log('   npm run setup           # Run setup script');
        console.log('');
        
        console.log('2️⃣  Run Your First Test:');
        console.log('   npm test                # Run all tests');
        console.log('   npm run test:frontend   # Run frontend tests only');
        console.log('');
        
        console.log('3️⃣  Development Workflow:');
        console.log('   npm run test:watch      # Start watch mode');
        console.log('   # Make changes to code or tests');
        console.log('   # Tests re-run automatically');
        console.log('');
        
        console.log('4️⃣  Check Coverage:');
        console.log('   npm run test:coverage   # Generate coverage report');
        console.log('   open coverage/lcov-report/index.html  # View HTML report');
        console.log('');
        
        console.log('5️⃣  Common Workflows:');
        console.log('   npm run test:backend              # Test API endpoints');
        console.log('   jest auth                         # Test authentication');
        console.log('   jest --testNamePattern="upload"   # Test file upload');
        console.log('   npm run test:verbose              # See detailed output');
        console.log('');
        
        console.log('📖 Need more help? Run: node help.js [topic]');
    }

    showStats() {
        console.log('📊 Test Suite Statistics\n');
        
        try {
            // Count test files
            const testFiles = this.countFiles('./__tests__', '.test.js');
            const fixtureFiles = this.countFiles('./fixtures', '.json');
            const mockFiles = this.countFiles('./__mocks__', '.js');
            const utilFiles = this.countFiles('./utils', '.js');
            
            console.log(`Test Files:    ${testFiles}`);
            console.log(`Fixture Files: ${fixtureFiles}`);
            console.log(`Mock Files:    ${mockFiles}`);
            console.log(`Util Files:    ${utilFiles}`);
            console.log(`Total Files:   ${testFiles + fixtureFiles + mockFiles + utilFiles}`);
            
            // Check if coverage exists
            if (fs.existsSync('./coverage/coverage-summary.json')) {
                console.log('\n📈 Latest Coverage:');
                const coverage = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'));
                const total = coverage.total;
                console.log(`Lines:     ${total.lines.pct}%`);
                console.log(`Functions: ${total.functions.pct}%`);
                console.log(`Branches:  ${total.branches.pct}%`);
                console.log(`Statements: ${total.statements.pct}%`);
            }
            
        } catch (error) {
            console.log('Could not read test statistics');
        }
    }

    countFiles(dir, extension) {
        try {
            if (!fs.existsSync(dir)) return 0;
            
            let count = 0;
            const items = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const item of items) {
                if (item.isDirectory()) {
                    count += this.countFiles(path.join(dir, item.name), extension);
                } else if (item.name.endsWith(extension)) {
                    count++;
                }
            }
            
            return count;
        } catch (error) {
            return 0;
        }
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    const guide = new JestHelpGuide();
    
    if (args.includes('--stats') || args.includes('-s')) {
        guide.showStats();
    } else if (args.length === 0) {
        guide.showHelp();
    } else {
        guide.showHelp(args[0]);
    }
}

if (require.main === module) {
    main();
}

module.exports = JestHelpGuide;
