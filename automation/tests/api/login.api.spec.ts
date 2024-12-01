import { test, expect } from "@playwright/test";
import * as td from "@data/testData";

test.describe("API Testing", () => {
  test("GET health check ", async ({ request }) => {
    const response = await request.get(`/`);
    expect(response.status()).toBe(200);
    const responseBody = JSON.parse(await response.text());
    expect(responseBody).toStrictEqual({ Laravel: "11.21.0" });
    console.log(responseBody);
  });

  test("POST register new user", async ({ request }) => {
    const response = await request.post(`register`, {
      data: {
        name: td.testUser1.name,
        email: td.testUser1.email,
        password: td.testUser1.password,
        password_confirmation: td.testUser1.password,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = JSON.parse(await response.text());
    expect(responseBody.user.created_at).toBeTruthy();
    console.log(responseBody);
  });

  test("POST register with mismatched passwords", async ({ request }) => {
    const response = await request.post(`register`, {
      data: {
        name: td.testUser1.name,
        email: td.testUser1.email,
        password: td.testUser1.password,
        password_confirmation: "wrongpassword",
      },
    });

    expect(response.status()).toBe(422);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });

  test("POST register with existing email", async ({ request }) => {
    // First register a user
    await request.post(`register`, {
      data: {
        name: td.testUser1.name,
        email: td.testUser1.email,
        password: td.testUser1.password,
        password_confirmation: td.testUser1.password,
      },
    });

    // Try to register again with same email
    const response = await request.post(`register`, {
      data: {
        name: td.testUser1.name,
        email: td.testUser1.email,
        password: td.testUser1.password,
        password_confirmation: td.testUser1.password,
      },
    });

    expect(response.status()).toBe(422);
    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
  });
});
