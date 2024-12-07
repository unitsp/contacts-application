import RegisterPage from "../../page-objects/RegisterPage";

describe('Register Page Tests', () => {

    const validName = "Test User";
    const validEmail = `testuser${Date.now()}@example.com`; // Unique email
    const validPassword = "TestPassword123";

    beforeEach(() => {
        // Visit the registration page before each test
        cy.visit('/register');
    });

    it('should successfully register a new user with valid details', () => {
        RegisterPage.fillName(validName);
        RegisterPage.fillEmail(validEmail);
        RegisterPage.fillPassword(validPassword);
        RegisterPage.fillPasswordConfirmation(validPassword);
        RegisterPage.submitForm();

        // Assert that the user is redirected to the appropriate page
        cy.url().should('include', '/contact-books');
    });

    it('should show an error message if the name field is left empty', () => {
        RegisterPage.fillEmail(validEmail);
        RegisterPage.fillPassword(validPassword);
        RegisterPage.fillPasswordConfirmation(validPassword);
        RegisterPage.submitForm();

        // Assert error message is displayed
        cy.contains('Name is required').should('be.visible');
    });

    it('should show an error message if the email field is invalid', () => {
        RegisterPage.fillName(validName);
        RegisterPage.fillEmail('invalid-email');
        RegisterPage.fillPassword(validPassword);
        RegisterPage.fillPasswordConfirmation(validPassword);
        RegisterPage.submitForm();

        // Assert the form is not submitted
        cy.url().should('include', '/register');
        // I would prefer to be able to validate on the popup, but it is outside of the dom
        // cy.contains('Please include an "@" ...').should('be.visible');
    });

    it('should show an error message if the password confirmation does not match', () => {
        RegisterPage.fillName(validName);
        RegisterPage.fillEmail(validEmail);
        RegisterPage.fillPassword(validPassword);
        RegisterPage.fillPasswordConfirmation('DifferentPassword123');
        RegisterPage.submitForm();

        // Assert error message is displayed
        cy.contains('Passwords do not match').should('be.visible');
    });

    it('should show an error message if the password is too weak', () => {
        const smallPassword = "123";
        RegisterPage.fillName(validName);
        RegisterPage.fillEmail(validEmail);
        RegisterPage.fillPassword(smallPassword);
        RegisterPage.fillPasswordConfirmation(smallPassword);
        RegisterPage.submitForm();

        // Assert error message is displayed
        cy.contains('Something went wrong').should("be.visible");
        // A better test would validate that a correct message is shown:
        // cy.contains('Password must be at least 8 characters long').should('be.visible');
    });

    it('should prevent submission if all fields are empty', () => {
        RegisterPage.submitForm();

        // Assert that the form is not submitted
        cy.url().should('include', '/register');
        cy.contains('Name is required').should('be.visible');
        cy.contains('Email is required').should('be.visible');
        cy.contains('Password is required').should('be.visible');
    });
});
