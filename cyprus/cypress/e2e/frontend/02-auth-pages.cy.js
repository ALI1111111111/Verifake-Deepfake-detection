// Fast Auth Pages Tests - Based on Actual Structure
describe('Login Page - Fast Tests', () => {
  beforeEach(() => {
    cy.visit('/login', { timeout: 5000 });
  });

  it('should load login page', () => {
    cy.url().should('include', '/login');
    cy.get('body').should('be.visible');
  });

  it('should display brand section', () => {
    // Based on your actual LoginPage structure
    cy.get('.brand-section').should('exist');
    cy.get('.brand-logo').should('contain', 'VeriFake');
    cy.get('.brand-title').should('be.visible');
  });

  it('should have email and password inputs', () => {
    // Looking for actual form inputs
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should allow typing in inputs', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
  });

  it('should have submit button', () => {
    cy.get('button[type="submit"]').should('be.visible');
  });
});

// Register Page Tests
describe('Register Page - Fast Tests', () => {
  beforeEach(() => {
    cy.visit('/register', { timeout: 5000 });
  });

  it('should load register page', () => {
    cy.url().should('include', '/register');
    cy.get('body').should('be.visible');
  });

  it('should have form inputs', () => {
    cy.get('input').should('have.length.at.least', 2);
  });

  it('should have register button', () => {
    cy.get('button').should('exist');
  });
});
