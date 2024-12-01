import { Page, Locator, expect } from "@playwright/test";

export default class HomePage {
  page: Page;
 loginButton: Locator;
 logOutButton: Locator;
 registerButton: Locator;
 emailInputField: Locator;
 passwordInputField: Locator;
 confirmPasswordInputField: Locator;
 userNameInputField: Locator;
 viewContactBooksButton: Locator;
 welcomeHeadingText: Locator;


  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.logOutButton = page.getByRole("button", { name: "Logout" });
    this.registerButton =  page.getByRole('button', { name: 'Register' });
    this.viewContactBooksButton =  page.getByRole('button', { name: 'View Contact Books' });
    this.welcomeHeadingText = page.getByRole("heading", { name: "Welcome to the Contacts App" });
  }



  async navigateToApp() {
    await this.page.goto('');
  }



  async clickLoginButton() {
    await this.loginButton.click();
  }

  async clickLogOutButton() {
    await this.logOutButton.click();
  }

  async viewContactBooks(){
    await this.viewContactBooksButton.click();
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

}
