import { Page, Locator, expect } from "@playwright/test";

export default class ContactBooksPage {
  page: Page;
  myContactBookHeadingText: Locator;
  createNewContactBookButton: Locator;
  createContactBookButton: Locator;
  updateContactBookButton: Locator;
  contactBookNameInput: Locator;
  viewDetailsButton:Locator;
  editButton: Locator;
  deleteButton: Locator;
  contactBookName: (contactBookName: string) => Locator;
  noContactsFoundText: Locator;
  creationConfirmationText: Locator;
  historyButton: Locator;



  constructor(page: Page) {
    this.page = page;
    this.myContactBookHeadingText = page.getByRole('heading', { name: 'My Contact Books' });
    this.createNewContactBookButton = page.getByRole("button", { name: "Create New Contact Book" });
    this.createContactBookButton= page.getByRole("button", { name: "Create Contact Book" });
    this.updateContactBookButton= page.getByRole("button", { name: "Update Contact Book" });
    this.contactBookNameInput = page.getByLabel("Contact Book Name");
    this.viewDetailsButton = page.getByRole("button", { name: "View Details" });
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.historyButton = page.getByRole("button", { name: "History" });
    this.contactBookName = (contactBookName: string) => page.getByText(contactBookName);
    this.noContactsFoundText = page.getByText("No contacts found.");
    this.creationConfirmationText = page.getByText('Contact creation started.')
  }


  async navigateToContactBook() {
    await this.page.goto('/contact-books');
  }

async clickCreateNewContactBookButton(){
    await this.createNewContactBookButton.click();
}

async createContactBookName(contactBookName: string){
    await this.clickCreateNewContactBookButton();
    await this.contactBookNameInput.fill(`${contactBookName}`);
    await this.createContactBookButton.click()
}

async updateContactBookName(contactBookName: string){
    await this.clickEdit();
    await this.contactBookNameInput.fill(`${contactBookName}`);
    await this.updateContactBookButton.click();
}

async addContact(contactUser: any) {
    await this.page.getByRole("button", { name: "Add Contact" }).click();

    await this.page.getByLabel('Contact Name').fill(contactUser.name);
    await this.page.getByLabel('Contact Email').fill(contactUser.email);
    await this.page.getByLabel('Contact Phone').fill(contactUser.phone);
    await this.page.getByRole("button", { name: "Create Contact" }).click();
    // The endpoint for creating a contact should intentionally take 20 seconds to respond to simulate a slow network or server load
    // Time out to handle slow network
    await this.page.waitForTimeout(20000)
}

async updateContact(contactUser: any) {
    await this.clickEdit();
    await this.page.getByLabel('Contact Email').fill(contactUser.email);
    await this.page.getByRole("button", { name: "Update Contact" }).click();
}


async deleteContact() {
    await this.clickDelete();
}

async clickViewDetails(){
    await this.viewDetailsButton.click()
}
async clickEdit(){
    await this.editButton.click()
}

async clickDelete(){
    await this.deleteButton.click()
}

async clickHistory(){
    await this.historyButton.click()
}
}
