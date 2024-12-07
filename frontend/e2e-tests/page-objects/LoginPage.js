class LoginPage {

    constructor() {
        this.emailInputField = '#email';
        this.passwordInputField = '#password';
        this.loginButton = 'button:contains("Login")';
    }    
    
    fillEmail(email) {
        cy.get(this.emailInputField).type(email);
    }
    
    fillPassword(password) {
        cy.get(this.passwordInputField).type(password);
    }
}


export default new LoginPage();