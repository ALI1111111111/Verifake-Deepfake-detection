// Fast Functionality Tests
describe('Basic Functionality - Fast Tests', () => {
  it('should complete basic navigation flow', () => {
    cy.visit('/', { timeout: 5000 });
    cy.get('.btn').contains('Log In').click();
    cy.url().should('include', '/login');
    
    cy.get('.logo').click();
    cy.url().should('not.include', '/login');
  });

  it('should handle page refreshes', () => {
    cy.visit('/login');
    cy.reload();
    cy.get('body').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should work on mobile viewport', () => {
    cy.viewport(375, 667);
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.get('.logo').should('be.visible');
  });
});

// Quick Cross-page Tests
describe('Cross-page Navigation - Fast Tests', () => {
  it('should navigate between auth pages', () => {
    cy.visit('/login');
    cy.get('a').contains(/register|sign.?up/i).first().click();
    cy.url().should('include', '/register');
    
    cy.get('a').contains(/log.?in/i).first().click();
    cy.url().should('include', '/login');
  });

  it('should handle browser back button', () => {
    cy.visit('/');
    cy.get('.btn').contains('Log In').click();
    cy.go('back');
    cy.url().should('not.include', '/login');
  });
});
