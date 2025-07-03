// Fast Dashboard Tests - Based on Actual Components
describe('Dashboard UI - Fast Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard', { timeout: 5000 });
  });

  it('should load dashboard page', () => {
    cy.url().should('include', '/dashboard');
    cy.get('body').should('be.visible');
  });

  it('should display dashboard navbar', () => {
    // Based on your actual dashboard navbar structure
    cy.get('.dashboard-navbar').should('exist');
    cy.contains('DEEPFAKE DETECTOR').should('be.visible');
    cy.get('.nav-links').should('exist');
  });

  it('should have file analysis card', () => {
    // Based on your dashboard structure
    cy.get('.dashboard-card').should('exist');
    cy.contains('Analyze New File').should('be.visible');
  });

  it('should have dropzone component', () => {
    // Based on your Dropzone component
    cy.get('[class*="border-2"]').should('exist'); // Dropzone styling
    cy.contains('Drag and drop a file here').should('be.visible');
  });

  it('should have file input', () => {
    // Check for file input from dropzone
    cy.get('input[type="file"]').should('exist');
  });

  it('should have service selection dropdown', () => {
    // Based on your service dropdown
    cy.get('select').should('exist');
    cy.get('option[value="deepfake"]').should('exist');
    cy.get('option[value="face"]').should('exist');
  });

  it('should have dashboard form', () => {
    cy.get('.dashboard-form').should('exist');
    cy.get('form').should('exist');
  });
});

// Quick File Upload Interface Tests
describe('File Upload Interface - Fast Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard', { timeout: 5000 });
  });

  it('should have interactive dropzone', () => {
    cy.get('input[type="file"]').should('exist');
    cy.get('[class*="cursor-pointer"]').should('exist');
  });

  it('should allow service selection', () => {
    cy.get('select').select('face');
    cy.get('select').should('have.value', 'face');
  });
});
