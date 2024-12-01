import { test, expect } from "@playwright/test";

test.describe("API Testing", () => {
  test("GET contact-books ", async ({ request }) => {
    const response = await request.get(`contact-books/`);

    expect(response.status()).toBe(200);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });

  test("POST & DELETE contact-books ", async ({ request }) => {
    const response = await request.post(`contact-books/`, {
      data: {
        name: "test book",
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = JSON.parse(await response.text());
    expect(responseBody.name).toBe("test book");
    expect(responseBody.id).toBeTruthy();
    console.log(responseBody);

    const bookId = responseBody.id;
    const deleteResponse = await request.delete(`contact-books/${bookId}`);
    expect(deleteResponse.status()).toBe(204);
  });

  test("GET contact-books with invalid endpoint", async ({ request }) => {
    const response = await request.get(`contact-books-invalid/`);

    expect(response.status()).toBe(404);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });

  test("GET contact-books with invalid authentication", async ({ request }) => {
    const response = await request.get(`contact-books/`, {
      headers: {
        Authorization: "Bearer invalid_token",
      },
    });

    expect(response.status()).toBe(401);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });
});
