#!/usr/bin/env node

/**
 * Jest Test Suite Setup Script
 * Automated setup and configuration for the Jest testing environment
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class JestSetup {
    constructor() {
        this.projectRoot = process.cwd();
        this.setupSteps = [];
        this.errors = [];
    }

    async runSetup() {
        console.log('🧪 Setting up Jest Test Suite for Deepfake Detection App\n');

        await this.checkNodeVersion();
        await this.checkProjectStructure();
        await this.installDependencies();
        await this.verifyTestStructure();
        await this.createGitIgnore();
        await this.runHealthCheck();
        
        this.displayResults();
    }

    async checkNodeVersion() {
        try {
            const version = process.version;
            const majorVersion = parseInt(version.slice(1).split('.')[0]);
            
            if (majorVersion >= 14) {
                this.logSuccess(`Node.js version ${version} is compatible`);
            } else {
                this.logError('Node.js version too old', 
                    'Please install Node.js 14 or higher from https://nodejs.org/');
            }
        } catch (error) {
            this.logError('Node.js not found', 
                'Please install Node.js from https://nodejs.org/');
        }
    }

    async checkProjectStructure() {
        const requiredPaths = [
            '../backend',
            '../frontend',
            './package.json',
            './jest.setup.js',
            './__tests__',
            './fixtures',
            './utils',
        ];

        let allFound = true;
        for (const filepath of requiredPaths) {
            if (fs.existsSync(filepath)) {
                this.logSuccess(`Found ${filepath}`);
            } else {
                this.logError(`Missing ${filepath}`, 
                    'Please ensure all required files and directories are present');
                allFound = false;
            }
        }

        if (allFound) {
            this.logSuccess('Project structure is complete');
        }
    }

    async installDependencies() {
        if (!fs.existsSync('./node_modules')) {
            console.log('\n📦 Installing test dependencies...');
            console.log('This may take a few minutes...\n');
            
            try {
                await this.runCommand('npm install');
                this.logSuccess('Dependencies installed successfully');
            } catch (error) {
                this.logError('Failed to install dependencies', 
                    'Run: npm install manually');
            }
        } else {
            this.logSuccess('Dependencies already installed');
            
            // Check if all required dependencies are present
            const requiredDeps = [
                'jest',
                '@testing-library/react',
                '@testing-library/jest-dom',
                'babel-jest',
            ];

            for (const dep of requiredDeps) {
                if (fs.existsSync(`./node_modules/${dep}`)) {
                    this.logSuccess(`${dep} is installed`);
                } else {
                    this.logError(`${dep} is missing`, 
                        `Run: npm install ${dep}`);
                }
            }
        }
    }

    async verifyTestStructure() {
        const testDirectories = [
            './__tests__/backend',
            './__tests__/frontend',
            './fixtures',
            './utils',
            './__mocks__',
        ];

        let testFilesCount = 0;
        for (const dir of testDirectories) {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                const testFiles = files.filter(f => f.endsWith('.test.js') || f.endsWith('.json') || f.endsWith('.js'));
                testFilesCount += testFiles.length;
                this.logSuccess(`${dir}: ${testFiles.length} files`);
            }
        }

        if (testFilesCount > 0) {
            this.logSuccess(`Total test and support files: ${testFilesCount}`);
        } else {
            this.logError('No test files found', 
                'Ensure test files are properly created');
        }
    }

    async createGitIgnore() {
        const gitignoreContent = `# Jest testing
node_modules/
coverage/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Test artifacts
.nyc_output/
junit.xml

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;

        try {
            if (!fs.existsSync('./.gitignore')) {
                fs.writeFileSync('./.gitignore', gitignoreContent);
                this.logSuccess('Created .gitignore file');
            } else {
                this.logSuccess('.gitignore already exists');
            }
        } catch (error) {
            this.logError('Failed to create .gitignore', 
                'Create .gitignore file manually');
        }
    }

    async runHealthCheck() {
        console.log('\n🔍 Running health check...\n');

        // Test Jest configuration
        try {
            await this.runCommand('npx jest --showConfig --silent');
            this.logSuccess('Jest configuration is valid');
        } catch (error) {
            this.logError('Jest configuration error', 
                'Check jest.setup.js and package.json configuration');
        }

        // Test sample test execution
        try {
            await this.runCommand('npm test -- --testNamePattern="should" --passWithNoTests');
            this.logSuccess('Test runner is working');
        } catch (error) {
            this.logError('Test runner has issues', 
                'Check test file syntax and Jest setup');
        }

        // Check if backend server is available (optional)
        try {
            const response = await this.checkUrl('http://127.0.0.1:8001/');
            this.logSuccess('Backend server is reachable');
        } catch (error) {
            this.logWarning('Backend server not running', 
                'Start backend server for integration tests');
        }

        // Check if frontend server is available (optional)
        try {
            const response = await this.checkUrl('http://localhost:5173');
            this.logSuccess('Frontend server is reachable');
        } catch (error) {
            this.logWarning('Frontend server not running', 
                'Start frontend server for integration tests');
        }
    }

    checkUrl(url) {
        const http = require('http');
        return new Promise((resolve, reject) => {
            const request = http.get(url, (response) => {
                resolve(response);
            });

            request.on('error', reject);
            request.setTimeout(3000, () => {
                request.destroy();
                reject(new Error('Timeout'));
            });
        });
    }

    runCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    logSuccess(message) {
        console.log(`✅ ${message}`);
        this.setupSteps.push({ type: 'success', message });
    }

    logError(message, solution) {
        console.log(`❌ ${message}`);
        this.errors.push({ message, solution });
    }

    logWarning(message, solution) {
        console.log(`⚠️  ${message}`);
        // Warnings don't block setup
    }

    displayResults() {
        console.log('\n' + '='.repeat(60));
        
        if (this.errors.length === 0) {
            console.log('🎉 JEST SETUP COMPLETE!');
            console.log('\nYour Jest testing environment is ready to use.\n');
            
            console.log('🚀 Quick Start Commands:');
            console.log('  npm test                    # Run all tests');
            console.log('  npm run test:watch          # Run tests in watch mode');
            console.log('  npm run test:coverage       # Run with coverage report');
            console.log('  npm run test:backend        # Run backend tests only');
            console.log('  npm run test:frontend       # Run frontend tests only');
            console.log('  npm run test:verbose        # Run with detailed output\n');
            
            console.log('📁 Test Structure:');
            console.log('  __tests__/backend/          # Backend API tests');
            console.log('  __tests__/frontend/         # Frontend component tests');
            console.log('  fixtures/                   # Test data files');
            console.log('  utils/                      # Test helper functions');
            console.log('  __mocks__/                  # Mock implementations\n');
            
            console.log('📖 Documentation:');
            console.log('  - Read package.json for all available scripts');
            console.log('  - Check __tests__/ for example test patterns');
            console.log('  - Use utils/testHelpers.js for common functions');
            console.log('  - Run "npm run help" for detailed guidance\n');
            
            console.log('Next steps:');
            console.log('1. Run: npm test');
            console.log('2. Start writing your own tests');
            console.log('3. Use npm run test:watch for development');
            
        } else {
            console.log(`⚠️  SETUP INCOMPLETE - ${this.errors.length} issue(s) found:`);
            console.log('');
            
            for (let i = 0; i < this.errors.length; i++) {
                console.log(`${i + 1}. Problem: ${this.errors[i].message}`);
                console.log(`   Solution: ${this.errors[i].solution}\n`);
            }
            
            console.log('Please fix these issues and run setup again:');
            console.log('node setup.js');
        }
        
        console.log('='.repeat(60));
    }
}

// Main execution
async function main() {
    const setup = new JestSetup();
    
    try {
        await setup.runSetup();
    } catch (error) {
        console.error('\n❌ Setup failed with error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = JestSetup;
