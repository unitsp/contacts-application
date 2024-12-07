import '../support/commands'
import LandingPage from '../../page-objects/LandingPage';
import LoginPage from '../../page-objects/LoginPage';


describe('Test Login Functionality', () => {
    it('Should be able to login with valid credentials', () => {
        cy.visit('/');
        cy.get(LandingPage.loginButton).click();
        LoginPage.fillEmail("admin@admin.com");
        LoginPage.fillPassword("password");
        cy.get(LoginPage.loginButton).click();

        cy.url().should('include', '/contact-books');
    })
    
    it('should not be able to login with invalid credentials', () => {
        cy.visit('/');
        cy.get(LandingPage.loginButton).click();
        LoginPage.fillEmail("admin@admin.com");
        LoginPage.fillPassword("nottherightpassword");
        cy.get(LoginPage.loginButton).click();

        cy.url().should('not.include', '/contact-books');
    })
})