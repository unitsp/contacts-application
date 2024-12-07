class RegisterPage {

    constructor() {
        this.nameInputField = '#name';
        this.emailInputField = '#email';
        this.passwordInputField = '#password';
        this.passwordConfirmationInputField = '#passwordConfirmation';
        this.submitButton = 'button[type="submit"]';
    }    

    fillName(name) {
        cy.get(this.nameInputField).type(name);
    }
    
    fillEmail(email) {
        cy.get(this.emailInputField).type(email);
    }
    
    fillPassword(password) {
        cy.get(this.passwordInputField).type(password);
    }
    
    fillPasswordConfirmation(passwordConfirmation) {
        cy.get(this.passwordConfirmationInputField).type(passwordConfirmation);
    }
    
    submitForm() {
        cy.get(this.submitButton).click();
    }
    
}


export default new RegisterPage();