import { last, values } from 'lodash';
import { TheThingCell, TheThing } from '@ygg/the-thing/core';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import {
  TheThingCreatorPageObjectCypress,
  TheThingViewPageObjectCypress
} from '../page-objects';

describe('Create a new the-thing', () => {
  const mockDatabase = new MockDatabase();
  const theThing: TheThing = TheThing.forge({
    cells: {
      綽號: TheThingCell.forge({ name: '綽號', type: 'text' }),
      興趣: TheThingCell.forge({ name: '興趣', type: 'longtext' }),
      售價: TheThingCell.forge({ name: '售價', type: 'number' }),
      照片: TheThingCell.forge({ name: '照片', type: 'album' }),
      地址: TheThingCell.forge({ name: '地址', type: 'address' })
    }
  });
  const testTheThingIds: string[] = [];

  // Wait for navigating to view page
  function waitForViewPage() {
    cy.location({ timeout: 10000 }).should(
      'not.match',
      /.*\/the-things\/create/
    );
    cy.location('pathname').then((pathname: any) => {
      const id = last((pathname as string).split('/'));
      cy.get('@testTheThingIds').then((ids: any) => {
        (ids as string[]).push(id);
      });
    });
  }

  before(function() {
    cy.wrap(testTheThingIds).as('testTheThingIds');
    login();
  });

  after(function() {
    cy.get('@testTheThingIds', { timeout: 20000 }).then((ids: any) => {
      // clear data
      for (const id of ids as string[]) {
        mockDatabase.delete(`${TheThing.collection}/${id}`);
      }
    });
  });

  it('Create a new the-thing, confirm data consistency', () => {
    // Navigate to the-thing creation page
    cy.visit('/the-things/create');

    const theThingCreatorPO = new TheThingCreatorPageObjectCypress();
    theThingCreatorPO.setValue(theThing);
    theThingCreatorPO.submit();
    waitForViewPage();

    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectValue(theThing);
  });

  // it('Create a relation, link to another the-thing', () => {

  // });

  // it('Create a relation, link to another the-thing, which is also created on the fly', () => {

  // });
});
