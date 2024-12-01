import { test, expect } from "@fixtures/contact-app";
import * as td from "@data/testData";

test.beforeEach(async ({ homePage }) => {
  await homePage.navigateToApp();
  await expect(homePage.welcomeHeadingText).toBeVisible();
  await homePage.clickRegisterButton();
});

test("Login - Register New user", async ({ loginPage, contactBooksPage }) => {
  await loginPage.registerNewUser(td.testUser1);
  await expect(contactBooksPage.myContactBookHeadingText).toBeVisible();
});

test("Login - Name Validation", async ({ loginPage }) => {
  await loginPage.clickSubmitButton();
  await expect(loginPage.nameValidationText).toBeVisible();
});
test("Login - Email Validation", async ({ loginPage }) => {
  await loginPage.clickSubmitButton();
  await expect(loginPage.emailValidationText).toBeVisible();
});

test("Login - Password Validation", async ({ loginPage }) => {
  await loginPage.passwordInputField.fill(td.testUser1.password);
  await loginPage.confirmPasswordInputField.fill(td.testUser2.password);
  await loginPage.clickSubmitButton();
  await expect(loginPage.passwordMismatchText).toBeVisible();
});
