class LandingPage {
    constructor(){
        this.loginButton = 'button:contains("Login")';
        this.registerButton = 'button:contains("Register")';
    }

    verifyHeadingText(expectedText) {
        cy.get('hl').should('contain.text', expectedText);
      }


}

export default new LandingPage();