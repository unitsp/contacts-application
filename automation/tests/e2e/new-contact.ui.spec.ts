import { test, expect } from "@fixtures/contact-app";
import * as td from "@data/testData";

test.beforeEach(async ({ homePage, loginPage }) => {
  await homePage.navigateToApp();
  await expect(homePage.welcomeHeadingText).toBeVisible();
  await homePage.clickRegisterButton();
  await loginPage.registerNewUser(td.testUser2);
});

test(
  "Contact - Add New",
  { tag: "@slow" },
  async ({ page, contactBooksPage }) => {
    await contactBooksPage.createContactBookName(td.newContactBookName);
    await contactBooksPage.clickViewDetails();
    await expect(contactBooksPage.noContactsFoundText).toBeVisible();
    const contactName = td.contactUser.name;
    await contactBooksPage.addContact(td.contactUser);
    await expect(contactBooksPage.creationConfirmationText).toBeVisible();
    await page.reload();
    await expect(page.getByText(contactName)).toBeVisible();
  }
);

// TODO Needs Update once Update Contact Functionality Fixed

test("Update New Contact",
  { tag: "@needs_fix" },async ({ page,contactBooksPage }) => {
  await contactBooksPage.createContactBookName(td.newContactBookName);
  await contactBooksPage.clickViewDetails();
  await expect(contactBooksPage.noContactsFoundText).toBeVisible();
  const contactName = td.contactUser.name
  await contactBooksPage.addContact(td.contactUser)
  await expect(contactBooksPage.creationConfirmationText).toBeVisible();
  await page.reload();
  await expect(page.getByText(contactName)).toBeVisible();
  await contactBooksPage.updateContact(td.contactUser);
  await page.waitForTimeout(20000)
  await expect(page.getByText('Failed to update contact.')).toBeVisible();
});

test(
  "Contact - Delete",
  { tag: "@slow" },
  async ({ page, contactBooksPage }) => {
    await contactBooksPage.createContactBookName(td.newContactBookName);
    await contactBooksPage.clickViewDetails();
    await expect(contactBooksPage.noContactsFoundText).toBeVisible();
    const contactName = td.contactUser.name;
    await contactBooksPage.addContact(td.contactUser);
    await expect(contactBooksPage.creationConfirmationText).toBeVisible();
    await page.reload();
    await expect(page.getByText(contactName)).toBeVisible();
    await contactBooksPage.deleteContact();
    await expect(contactBooksPage.noContactsFoundText).toBeVisible();
  }
);
