import { Page, Locator, expect } from "@playwright/test";
import { testUser1 } from "../data/testData";

export default class LoginPage {
  page: Page;
 loginButton: Locator;
 logOutButton: Locator;
 registerButton: Locator;
 emailInputField: Locator;
 passwordInputField: Locator;
 confirmPasswordInputField: Locator;
 userNameInputField: Locator;
 viewContactBooksButton: Locator;
nameValidationText: Locator;
emailValidationText: Locator;
passwordValidationText: Locator;
passwordMismatchText: Locator;


  constructor(page: Page) {
    this.page = page;
    this.emailInputField = page.getByLabel("Email");
    this.userNameInputField = page.getByLabel("Name");
    this.passwordInputField =  page.getByLabel("Password", { exact: true });
    this.confirmPasswordInputField =  page.getByLabel("Confirm Password", { exact: true });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.logOutButton = page.getByRole("button", { name: "Logout" });
    this.registerButton =  page.getByRole('button', { name: 'Register' });
    this.viewContactBooksButton =  page.getByRole('button', { name: 'View Contact Books' });
    this.nameValidationText = page.getByText('Name is required');
    this.emailValidationText = page.getByText('Email is required');
    this.passwordValidationText = page.getByText('Password is required');
    this.passwordMismatchText = page.getByText('Passwords do not match');
  
  }

  async navigateToLogin() {
    await this.page.goto('/login');
  }

  async navigateToRegister() {
    await this.page.goto('/register');
  }


  async loginAsExistingUser(username: string, password: string) {
    await this.clickLoginButton();
    await this.emailInputField.fill(`${username}`);
    await this.passwordInputField.fill(`${password}`);
    await this.clickLoginButton();
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async viewContactBooks(){
    await this.viewContactBooksButton.click();
  }

  async clickSubmitButton(){
    await this.page.getByRole("button", { name: "Submit" }).click();

  }


  async registerNewUser(testUser: any) {
    await this.userNameInputField.fill(testUser.name);
    await this.emailInputField.fill(testUser.email);
    await this.passwordInputField.fill(testUser.password);
    await this.confirmPasswordInputField.fill(testUser.password);
    await this.clickSubmitButton();
  }
}
