import { test as baseTest } from "@playwright/test";
import LoginPage from "../pages/loginPage";
import HomePage from "../pages/homePage";
import ContactBooksPage from "../pages/contactBooksPage"

type contactAppFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  contactBooksPage: ContactBooksPage;
};

export const test = baseTest.extend<contactAppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  contactBooksPage: async ({ page }, use) => {
    await use(new ContactBooksPage(page));
  },
});

export { expect } from "@playwright/test";
