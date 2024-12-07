import LandingPage from "../../page-objects/LandingPage";
import LoginPage from "../../page-objects/LoginPage";

/// <reference types="cypress" />
//
//

Cypress.Commands.add('login', (email, password) => { 
    cy.visit('/');
        cy.get(LandingPage.loginButton).click();
        LoginPage.fillEmail(email);
        LoginPage.fillPassword(password);
        cy.get(LoginPage.loginButton).click();

        cy.url().should('include', '/contact-books');
})
