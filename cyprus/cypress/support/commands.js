// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login via API
Cypress.Commands.add('loginViaAPI', (email = Cypress.env('testEmail'), password = Cypress.env('testPassword')) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('user');
    
    // Store token and user data
    window.localStorage.setItem('token', response.body.token);
    cy.window().then((win) => {
      win.localStorage.setItem('token', response.body.token);
    });
    
    return response.body;
  });
});

// Custom command to register via API
Cypress.Commands.add('registerViaAPI', (name, email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/register`,
    body: {
      name,
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(201);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('user');
    
    return response.body;
  });
});

// Custom command to login via UI
Cypress.Commands.add('loginViaUI', (email = Cypress.env('testEmail'), password = Cypress.env('testPassword')) => {
  cy.visit('/login');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('token');
  });
  cy.visit('/login');
});

// Custom command to make authenticated API requests
Cypress.Commands.add('apiRequest', (method, endpoint, body = {}) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('token');
    
    cy.request({
      method,
      url: `${Cypress.env('apiUrl')}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: method !== 'GET' ? body : undefined
    });
  });
});

// Custom command to upload file
Cypress.Commands.add('uploadFile', (selector, fileName, fileType = 'image/jpeg') => {
  cy.get(selector).then(subject => {
    cy.fixture(fileName, 'base64').then(content => {
      const blob = Cypress.Blob.base64StringToBlob(content, fileType);
      const file = new File([blob], fileName, { type: fileType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      const input = subject[0];
      input.files = dataTransfer.files;
      
      cy.wrap(subject).trigger('change', { force: true });
    });
  });
});

// Custom command to check API response structure
Cypress.Commands.add('checkResponseStructure', (response, expectedKeys) => {
  expectedKeys.forEach(key => {
    expect(response.body).to.have.property(key);
  });
});

// Custom command to wait for API call to complete
Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201, 204]);
  });
});

// Custom command to check if element is visible and has text
Cypress.Commands.add('shouldBeVisibleAndContain', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).should('be.visible').and('contain', text);
});

// Custom command to clear local storage and session storage
Cypress.Commands.add('clearAllStorage', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});
