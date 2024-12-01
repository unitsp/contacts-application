import { test, expect } from "@playwright/test";
import * as td from "@data/testData";

test.describe("API Testing", () => {
  test("API - POST new contact to contact book", async ({ request }) => {
    // First get available contact books
    const booksResponse = await request.get(`contact-books/`);
    expect(booksResponse.status()).toBe(200);
    const booksResponseBody = JSON.parse(await booksResponse.text());
    const contactBookId = booksResponseBody[0].id;

    // Then create a new contact in the first available contact book
    const response = await request.post(
      `contact-books/${contactBookId}/contacts`,
      {
        data: {
          name: td.contactUser.name,
          email: td.contactUser.email,
          phone: td.contactUser.phone,
        },
      }
    );

    expect(response.status()).toBe(202);
    const responseBody = JSON.parse(await response.text());
    expect(responseBody.message).toBe("Contact creation task has been created");
    console.log(responseBody);
  });

  test("API - Validate email format in contact creation", async ({ request }) => {
    const booksResponse = await request.get(`contact-books/`);
    const booksResponseBody = JSON.parse(await booksResponse.text());
    const contactBookId = booksResponseBody[0].id;

    const response = await request.post(
      `contact-books/${contactBookId}/contacts`,
      {
        data: {
          name: td.contactUser.name,
          email: "invalid-email",
          phone: td.contactUser.phone,
        },
      }
    );

    expect(response.status()).toBe(422);
  });

  // Phone validation broken
  test("API - Validate phone format in contact creation", async ({ request }) => {
    const booksResponse = await request.get(`contact-books/`);
    const booksResponseBody = JSON.parse(await booksResponse.text());
    const contactBookId = booksResponseBody[0].id;

    const response = await request.post(
      `contact-books/${contactBookId}/contacts`,
      {
        data: {
          name: td.contactUser.name,
          email: td.contactUser.email,
          phone: "invalid-phone",
        },
      }
    );

    expect(response.status()).toBe(422);
    const responseBody = JSON.parse(await response.text());
  });});
