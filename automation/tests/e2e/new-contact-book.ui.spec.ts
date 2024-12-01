import { test, expect } from "@fixtures/contact-app";
import * as td from "@data/testData";

test.beforeEach(async ({ homePage, loginPage }) => {
  await homePage.navigateToApp();
  await expect(homePage.welcomeHeadingText).toBeVisible();
  await homePage.clickRegisterButton();
});

test(
  "Contact Book - Create New",
  { tag: "@fast" },
  async ({ contactBooksPage, loginPage }) => {
    await loginPage.registerNewUser(td.testUser1);
    await contactBooksPage.createContactBookName(td.newContactBookName);
    await expect(
      contactBooksPage.contactBookName(td.newContactBookName)
    ).toBeVisible();
    await contactBooksPage.updateContactBookName(td.updatedContactBookName);
    await expect(
      contactBooksPage.contactBookName(td.updatedContactBookName)
    ).toBeVisible();
    await contactBooksPage.clickDelete();
    await expect(contactBooksPage.contactBookNameInput).toBeHidden();
  }
);

test(
  "Contact Book - Update",
  { tag: "@fast" },
  async ({ contactBooksPage, loginPage }) => {
    await loginPage.registerNewUser(td.testUser2);
    await contactBooksPage.createContactBookName(td.newContactBookName);
    await expect(
      contactBooksPage.contactBookName(td.newContactBookName)
    ).toBeVisible();
    await contactBooksPage.updateContactBookName(td.updatedContactBookName);
    await expect(
      contactBooksPage.contactBookName(td.updatedContactBookName)
    ).toBeVisible();
  }
);

test(
  "Contact Book - Delete",
  { tag: "@fast" },
  async ({ loginPage, contactBooksPage }) => {
    await loginPage.registerNewUser(td.testUser2);
    await contactBooksPage.createContactBookName(td.newContactBookName);
    await expect(
      contactBooksPage.contactBookName(td.newContactBookName)
    ).toBeVisible();
    await contactBooksPage.updateContactBookName(td.updatedContactBookName);
    await expect(
      contactBooksPage.contactBookName(td.updatedContactBookName)
    ).toBeVisible();
    await contactBooksPage.clickDelete();
    await expect(contactBooksPage.contactBookNameInput).toBeHidden();
  }
);
