import ContactBooksPage from "../../page-objects/ContactBooksPage"

describe("Contact Books Page Tests", () => {
    beforeEach(() => {
      // Log in before each test (assuming you have a global login function)
      cy.login("admin@admin.com", "password")
    });

    it("should create a new contact book", () => {
        const contactBookName = "Test Contact Book";
        ContactBooksPage.CreateNewContactBook(contactBookName);
    
        // Assert that the new contact book appears in the list
        cy.contains("ul > li", contactBookName).should("exist");
    });
    
    it("should edit an existing contact book", () => {
        const oldName = "Test Contact Book";
        const newName = "Updated Contact Book";
    
        ContactBooksPage.editListItemByName(oldName, newName);
    
        // Assert that the old name is no longer visible
        cy.contains("ul > li", oldName).should("not.exist");
    
        // Assert that the new name is visible
        cy.contains("ul > li", newName).should("exist");
    });
    
    it("should delete an existing contact book", () => {
        const contactBookName = "Updated Contact Book";
    
        ContactBooksPage.deleteListItemByName(contactBookName);
    
        // Assert that the contact book is no longer visible
        cy.contains("ul > li", contactBookName).should("not.exist");
    });
    
    it("should navigate to the contact book details page", () => {
        const contactBookName = "Details Test Book";
        ContactBooksPage.CreateNewContactBook(contactBookName);
    
        ContactBooksPage.navigateToContactBookDetailsByName(contactBookName);
    
        // Assert that the URL changes to the details page
        cy.url().should("include", `/contact-books/`);
    });
});