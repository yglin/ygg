import { last, values } from 'lodash';
import { TheThingCell, TheThing } from '@ygg/the-thing/core';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import { TheThingCreatorPageObjectCypress, TheThingViewPageObjectCypress } from "../page-objects";

describe('Create a new the-thing', () => {
  const mockDatabase = new MockDatabase();
  const theThing: TheThing = TheThing.forge({
    cells: {
      綽號: TheThingCell.forge({ name: '綽號', type: 'text' }),
      興趣: TheThingCell.forge({ name: '興趣', type: 'longtext' }),
      售價: TheThingCell.forge({ name: '售價', type: 'number' })
    }
  });

  before(function() {
    login();
  });

  after(function() {
    cy.get('@newTheThingId').then(id => {
      // clear data
      mockDatabase.delete(`${TheThing.collection}/${id}`);
    });
  });

  it('Create a new the-thing, confirm data consistency', () => {
    // Navigate to the-thing creation page
    cy.visit('/the-things/create');

    const theThingCreatorPO = new TheThingCreatorPageObjectCypress();
    theThingCreatorPO.setValue(theThing);
    theThingCreatorPO.submit();

    // Wait for navigating to view page
    cy.location({ timeout: 10000 }).should(
      'not.match',
      /.*\/the-things\/create/
    );
    cy.location('pathname').then((pathname: any) => {
      const id = last((pathname as string).split('/'));
      cy.wrap(id).as('newTheThingId');
    });

    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectValue(theThing);

  });
});
