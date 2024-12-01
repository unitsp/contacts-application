import { faker } from "@faker-js/faker";


export const testUser1 = {
    email: faker.internet.email(),
    // password: "Tests1234!",
    password: faker.internet.password({
      length: 12,
      memorable: true,
      pattern: /[A-Za-z0-9!@#$%^&*]/
    }),
    name: faker.person.fullName(),
  };


  export const testUser2 = {
    email: faker.internet.email(),
    // password: "Tests1234!",
    password: faker.internet.password({
      length: 12,
      memorable: true,
      pattern: /[A-Za-z0-9!@#$%^&*]/
    }),
    name: faker.person.fullName(),
  };

  export const invalidInputs = {
    email: faker.internet.email(),
    password: '',
    name: '',
  };

export const contactUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number({ style: 'national' })
}

export const updatedUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
}

export const newContactBookName = faker.company.buzzAdjective();
export const updatedContactBookName = faker.company.buzzAdjective();