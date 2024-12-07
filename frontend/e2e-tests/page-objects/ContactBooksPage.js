class ContactBooksPage{
    constructor(){
        this.newContactNameField = "#contact-book-name";
        this.editButton = 'button:contains("Edit")';
        this.deleteButton = 'button:contains("Delete")';
        this.viewDetailsButton = 'button:contains("View Details")';
        this.createNewContactBookButton = 'button:contains("Create New Contact Book")';
        this.createContactBookButton = 'button:contains("Create Contact Book")';
        this.updateContactBookButton = 'button:contains("Update Contact Book")';
    }

    CreateNewContactBook(contactName){
        cy.get(this.createNewContactBookButton).click();
        cy.get(this.newContactNameField).type(contactName);
        cy.get(this.createContactBookButton).click();
    }

    getListItemIndexByName(name) {
        return cy
          .get('ul > li') // Select all <li> elements
          .then(($list) => {
            // Loop through each <li> to find the one with the matching <h2> text
            let index = -1;
            $list.each((i, el) => {
              const listItemName = Cypress.$(el).find('h2').text().trim();
              if (listItemName === name) {
                index = i + 1; // nth-child is 1-based
              }
            });
            if (index === -1) {
              throw new Error(`List item with name "${name}" not found`);
            }
            return index;
          });
    }

    editListItemByName(oldName, newName){
        this.getListItemIndexByName(oldName).then((n) => {
            cy.get(`ul > li:nth-child(${n})`)
              .find(this.editButton)
              .click();
          });
        cy.get(this.newContactNameField).clear().type(newName);
        cy.get(this.updateContactBookButton).click();
    }

    deleteListItemByName(name){
        this.getListItemIndexByName(name).then((n)=> {
            cy.get(`ul > li:nth-child(${n})`)
            .find(this.deleteButton)
            .click()
        })
    }

    navigateToContactBookDetailsByName(name){
        this.getListItemIndexByName(name).then((n) => {
            cy.get(`ul > li:nth-child(${n})`)
              .find(this.viewDetailsButton)
              .click(); 
        });
    }

}

export default new ContactBooksPage();