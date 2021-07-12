import { theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { testUsers } from '@ygg/shared/user/test';
import { defaultMapView } from './map/map';

export function myBeforeAll() {
  window.localStorage.setItem('visited', 'true');
  const treasureMap = {
    lastView: defaultMapView
  };
  window.localStorage.setItem('treasureMap', JSON.stringify(treasureMap));
  cy.wrap(testUsers).each((user: User) => {
    theMockDatabase.insert(`${User.collection}/${user.id}`, user);
  });
}
