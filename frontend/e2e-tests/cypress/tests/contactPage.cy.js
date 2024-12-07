import ContactPage from "../../page-objects/ContactPage";

describe("Contact Books Page Tests", () => {
    beforeEach(() => {
        cy.login("admin@admin.com", "password")
        cy.visit("contact-books/1/contacts")
    });
  
    it("should add a new contact", () => {
      const name = "John Doe";
      const email = "johndoe@example.com";
      const phone = "123-456-7890";
  
      ContactPage.addNewContact(name, email, phone);
  
      // Assert that the new contact is displayed in the list
      cy.contains("ul > li", name).should("exist");
    });
    
    it("should edit an existing contact", () => {
      const originalName = "John Doe";
      const updatedDetails = {
        newName: "Jane Doe",
        email: "janedoe@example.com",
        phone: "987-654-3210",
      };
  
      ContactPage.editContact({ 
        name: originalName, 
        ...updatedDetails 
      });
  
      // Assert the original name no longer exists
      cy.contains("ul > li", originalName).should("not.exist");
  
      // Assert the updated contact exists
      cy.contains("ul > li", updatedDetails.newName).should("exist");
    });
  
    it("should delete a contact", () => {
        cy.get('ul > li', { timeout: 10000 }).then(($list) => {
            const itemCount = $list.length;
    
            if (itemCount === 0) {
              throw new Error("No contacts found in the contact book.");
            }
        
            const randomIndex = Math.floor(Math.random() * itemCount) + 1;
        
            cy.get(`ul > li:nth-child(${randomIndex})`)
            .find(ContactPage.deleteButton).click()
        }).then(() => {
            cy.get(ContactPage.statusPopup).should("contain.text", "Contact deleted successfully.")
        });
        
    });
  
    it("should view the history of a contact", () => {
        const name = "John Doe";
        const name2 = "Jane Doe";
        const email = "johndoe@example.com";
        const phone = "123-456-7890";
    
        ContactPage.addNewContact(name, email, phone);
        cy.get(ContactPage.statusPopup, {timeout:30000}).should("exist");
        cy.reload();
        ContactPage.editContact({name:name, name2:name2, email:"thisisanemail@example.com", phone:"1234567890"});
        cy.get(ContactPage.statusPopup, {timeout:30000}).should("exist");
        cy.reload();
  
      ContactPage.viewContactHistory(name2);
  
      // Assert that the history modal is displayed
      cy.contains("h3", "Change History").should("be.visible");
  
      // Close the history modal/dialog
      cy.get(ContactPage.closeHistoryButton).click();
  
      // Assert that the modal is no longer visible
      cy.contains("h3", "Change History").should("not.exist");
    });
  
    it("should not allow adding a contact without a name", () => {
      const email = "noname@example.com";
      const phone = "123-123-1234";
  
      // Try to add a contact without a name
      ContactPage.addNewContact("", email, phone);
  
      // Assert error message is displayed
      cy.get(ContactPage.statusPopup).should('contain.text', 'Please fill in all fields.');
    });

    it("should not be allow adding two users with the same email", () => {
        const email = "dontdupeme@example.com";
        const name1 = "Joseph Doe";
        const name2 = "Jillian Doe";
        const phone1 = "234567890";
        const phone2 = "0987654321"

        // Create Contact with email successfully
        ContactPage.addNewContact(name1,email,phone1)
        cy.get(ContactPage.statusPopup, { timeout:30000 }).should("exist")
        
        // Second Contact create should fail due to dupe email input
        ContactPage.addNewContact(name2, email, phone2)
        cy.get(ContactPage.statusPopup).should("contain.text", "Failed to create contact")

    })
  });