import { last, values } from 'lodash';
import { TheThingCell, TheThing } from '@ygg/the-thing/core';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import {
  TheThingCreatorPageObjectCypress,
  TheThingViewPageObjectCypress
} from '../page-objects';

describe('Create a new the-thing', () => {
  const mockDatabase = new MockDatabase();
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

  before(() => {
    login();
  });

  beforeEach(() => {
    cy.wrap(testTheThingIds).as('testTheThingIds');
  });

  after(function() {
    cy.get('@testTheThingIds', { timeout: 20000 }).then((ids: any) => {
      // clear data
      for (const id of ids as string[]) {
        mockDatabase.delete(`${TheThing.collection}/${id}`);
      }
    });
    mockDatabase.clear();
  });

  beforeEach(function() {
    // Navigate to the-thing creation page
    cy.visit('/the-things/create');
  });

  it('Create a new the-thing with all cell-types, then confirm data consistency', () => {
    const theThing: TheThing = TheThing.forge({
      cells: {
        綽號: TheThingCell.forge({ name: '綽號', type: 'text' }),
        興趣: TheThingCell.forge({ name: '興趣', type: 'longtext' }),
        售價: TheThingCell.forge({ name: '售價', type: 'number' }),
        照片: TheThingCell.forge({ name: '照片', type: 'album' }),
        地址: TheThingCell.forge({ name: '地址', type: 'address' })
      }
    });
    const theThingCreatorPO = new TheThingCreatorPageObjectCypress();
    theThingCreatorPO.setValue(theThing);
    theThingCreatorPO.submit();
    waitForViewPage();

    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectValue(theThing);
  });

  it('Create a relation, link to another the-thing', () => {
    // Stub one the-thing "Samwise Gamgee" with type "Hobbit"
    // and save it into mock database in advance
    const Sam = TheThing.forge();
    Sam.name = 'Samwise Gamgee';
    Sam.types.push('Hobbit');
    mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());
    // Stub another the-thing "Frodo Baggins" with same type "Hobbit"
    // We are going to use "Frodo Baggins" to fill in creator form,
    // and find/select "Samwise Gamgee" to add the realtion "dirty thief covet my preasuuuuuress"
    const Frodo = TheThing.forge();
    Frodo.types.push('Hobbit');
    Frodo.name = 'Frodo Baggins';
    const relationName = 'dirty thief covet my preasuuuuuress';
    const theThingCreatorPO = new TheThingCreatorPageObjectCypress();
    theThingCreatorPO.setValue(Frodo);
    theThingCreatorPO.addRelationExist(relationName, Sam);
    theThingCreatorPO.submit();
    waitForViewPage();

    // In the view page of "Frodo Baggins",
    // we expect to find "Samwise Gamgee" in the relation "dirty thief covet my preasuuuuuress"
    const FrodoViewPO = new TheThingViewPageObjectCypress();
    FrodoViewPO.expectRelation(relationName, Sam);
  });

  // it('Create a relation, link to another the-thing, which is also created on the fly', () => {

  // });
});
