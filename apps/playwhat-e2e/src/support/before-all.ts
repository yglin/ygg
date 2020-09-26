import {
  beforeAll as beforeAllCypress,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { testUsers } from '@ygg/shared/user/test';

export function beforeAll(): Cypress.Chainable<any> {
  beforeAllCypress();
  return cy.wrap(testUsers).each((user: User) => {
    theMockDatabase.insert(`${User.collection}/${user.id}`, user);
  });
}
