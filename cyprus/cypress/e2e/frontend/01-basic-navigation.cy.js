// Fast Landing Page Tests - Based on Actual HTML
describe('Landing Page - Quick Tests', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 5000 });
  });

  it('should load landing page quickly', () => {
    cy.get('body').should('be.visible');
    cy.contains('VeriFake').should('be.visible');
  });

  it('should find navigation elements', () => {
    // Based on your actual navbar structure
    cy.get('.navbar').should('exist');
    cy.get('.logo').should('contain', 'VeriFake');
    cy.get('.nav-links').should('exist');
  });

  it('should show auth buttons for non-authenticated users', () => {
    // Based on your actual auth-buttons structure
    cy.get('.auth-buttons').should('exist');
    cy.get('.btn').contains('Log In').should('be.visible');
    cy.get('.btn').contains('Sign Up').should('be.visible');
  });

  it('should have hero section', () => {
    // Based on your hero section
    cy.get('.hero').should('exist');
    cy.contains('Detect Deep Fake Easily').should('be.visible');
    cy.get('.hero-buttons').should('exist');
  });
});

// Quick Navigation Tests
describe('Navigation - Fast Tests', () => {
  it('should navigate to login', () => {
    cy.visit('/');
    cy.get('.btn').contains('Log In').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to register', () => {
    cy.visit('/');
    cy.get('.btn').contains('Sign Up').click();
    cy.url().should('include', '/register');
  });

  it('should navigate via logo', () => {
    cy.visit('/login');
    cy.get('.logo').click();
    cy.url().should('not.include', '/login');
  });
});
