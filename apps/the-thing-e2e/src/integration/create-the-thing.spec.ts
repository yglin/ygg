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
  function waitForViewPage(
    newIdAlias: string = 'newTheThingId'
  ): Cypress.Chainable<any> {
    cy.location({ timeout: 10000 }).should(
      'not.match',
      /.*\/the-things\/create/
    );
    cy.location('pathname').then((pathname: any) => {
      const id = last((pathname as string).split('/'));
      cy.get('@testTheThingIds').then((ids: any) => {
        (ids as string[]).push(id);
      });
      cy.wrap(id).as(newIdAlias);
    });
    return cy.get(`@${newIdAlias}`, { timeout: 10000 });
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
    // Stub the-thing "Samwise Gamgee" with type "Hobbit"
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

  it('Create a relation, link to another the-thing which is also created on the fly', () => {
    // Stub 2 the-things "Nobita" with type "Loser", and "Doraemon" with type "Savior"
    // The test relation is "Save my sorry ass" from "Nobita" to "Doraemon"
    const nobita = TheThing.forge({ name: 'Nobita', types: ['loser'] });
    const doraemon = TheThing.forge({ name: 'Doraemon', types: ['savior'] });
    const relationName = 'Save my sorry ass';

    // Fill in data of "Nobita"
    const theThingCreatorPO = new TheThingCreatorPageObjectCypress();
    theThingCreatorPO.setValue(nobita);

    // Set relation name "Save my sorry ass", and go-to creation of "Doraemon"
    theThingCreatorPO.addRelationAndGotoCreate(relationName);
    // Now should be the second-level creation page
    theThingCreatorPO.setValue(doraemon);
    theThingCreatorPO.submit();
    waitForViewPage('doraemonId').then(doraemonId => {
      doraemon.id = doraemonId;
      const theThingViewPO = new TheThingViewPageObjectCypress();
      theThingViewPO.expectValue(doraemon);

      // Now link relation back to the creation of "Nobita", should see the test relation
      theThingViewPO.linkRelationBack();
      theThingCreatorPO.expectVisible();
      theThingCreatorPO.expectRelation(relationName, doraemon);

      // Submit and redirect to view page of "Nobita", should see the test relation
      theThingCreatorPO.submit();
      waitForViewPage('nobitaId').then(nobitaId => {
        nobita.id = nobitaId;
        theThingViewPO.expectValue(nobita);
        theThingViewPO.expectRelation(relationName, doraemon);

        // Now there should not be button of linkRelationBack() any more
        theThingViewPO.expectNotLinkRelationBack();
      });
    });
  });
});
