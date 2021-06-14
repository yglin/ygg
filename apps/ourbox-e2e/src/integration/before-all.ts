import { theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { testUsers } from '@ygg/shared/user/test';

export function myBeforeAll() {
  window.localStorage.setItem('visited', 'true');
  cy.wrap(testUsers).each((user: User) => {
    theMockDatabase.insert(`${User.collection}/${user.id}`, user);
  });
}
