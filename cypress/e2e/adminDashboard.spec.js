describe('Admin Dashboard', () => {
    beforeEach(() => {
        cy.intercept('POST', '/api/login', {
          statusCode: 200,
          body: { token: 'fake-jwt-token' },
        }).as('loginRequest');
      
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
      
        cy.wait('@loginRequest'); 
      
        cy.url().should('include', '/dashboard');
      });
      
  
    it('should display the dashboard overview', () => {
      cy.contains('Total Ingredients').should('exist');
      cy.contains('Total Category').should('exist');
      cy.contains('Total Users').should('exist');
    });
  
    it('should allow adding a new ingredient', () => {
      cy.contains('Add Ingredient').click();
  
      cy.get('input[name="name"]').type('New Ingredient');
      cy.get('button[type="submit"]').click();
  
      cy.contains('New Ingredient').should('exist');
    });
  
    it('should allow blocking a user', () => {
      cy.contains('Users').click();
  
      cy.get('button').contains('Block').first().click();
  
      cy.contains('Blocked').should('exist');
    });
  });