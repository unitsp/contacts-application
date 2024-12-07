class ContactPage{
    constructor(){
        this.addContactButton = 'button:contains("Add Contact")';
        this.editButton = 'button:contains("Edit")';
        this.deleteButton = 'button:contains("Delete")';
        this.nameField = '#contact-name';
        this.emailField = '#contact-email';
        this.phoneField = '#contact-phone';
        this.updateContactButton = 'button:contains("Update Contact")';
        this.createContactButton = 'button:contains("Create Contact")';
        this.contactHistoryButton = 'button:contains("History")';
        this.closeHistoryButton = 'button:contains("Close")';
        this.statusPopup = 'div[role="status"]';
    }
// Class Methods
    // This is a repeated function, can likely move to a helper function
    getListItemIndexByName(name) {
        return cy
          .get('ul > li', { timeout: 30000 }) // Wait for the list items to load
          .should('exist')
          .then(($list) => {
              let index = -1;
              $list.each((i, el) => {
                  const listItemName = Cypress.$(el).find('h2').text().trim();
                  if (listItemName === name) {
                      index = i + 1; // nth-child is 1-based
                  }
              });
              if (index === -1) {
                  throw new Error(`List item with name "${name}" not found within 10s`);
              }
              return index;
          });
    }

    addNewContact(name, email, phone){
        cy.get(this.addContactButton).click();

        if (name) {
            cy.get(this.nameField).type(name);
        }
        if (email){
            cy.get(this.emailField).type(email);
        }
        if (phone) {
            cy.get(this.phoneField).type(phone);
        }
        
        cy.get(this.createContactButton).click();
    };

    editContact({name, newName, email, phone} = {}){
        this.getListItemIndexByName(name).then((n) => {
            cy.get(`ul > li:nth-child(${n})`)
            .find(this.editButton)
            .click();
        });
        if (newName) {
            cy.get(this.nameField).clear()
            .type(newName)
        }
        if (email) {
            cy.get(this.emailField).clear()
            .type(email)
        }
        if (phone) {
            cy.get(this.phoneField).clear()
            .type(phone)
        }
        cy.get(this.updateContactButton).click();
    };

    deleteContact(name){
        this.getListItemIndexByName(name).then((n) => {
            cy.get(`ul > li:nth-child(${n})`)
            .find(this.deleteButton)
            .click();
        });
    };

    viewContactHistory(name){
        this.getListItemIndexByName(name).then((n) => {
            cy.get(`ul > li:nth-child(${n})`)
            .find(this.contactHistoryButton)
            .click();
        });
    };
}

export default new ContactPage();