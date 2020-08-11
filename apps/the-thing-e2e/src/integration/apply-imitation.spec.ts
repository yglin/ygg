import {
  TheThing,
  TheThingImitation,
  ImitationsDataPath,
  ImitationDog
} from '@ygg/the-thing/core';
import { kakapo, kiwi, littlePenguin } from './australia-birbs';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import {
  MyThingsPageObjectCypress,
  ImitationViewDogPageObjectCypress
} from '@ygg/the-thing/test';

describe('Apply imitation to the-thing', () => {
  const mockDatabase = new MockDatabase();
  const theThings: TheThing[] = [kakapo, kiwi, littlePenguin];
  const imitation: TheThingImitation = ImitationDog;

  before(() => {
    login().then(user => {
      cy.wrap(theThings).each((theThing: any) => {
        theThing.ownerId = user.id;
        mockDatabase.insert(
          `${TheThing.collection}/${theThing.id}`,
          theThing.toJSON()
        );
        // mockDatabase.backupRTDB(ImitationsDataPath);
        // mockDatabase.insertRTDB(
        //   `${ImitationsDataPath}/${imitation.id}`,
        //   imitation.toJSON()
        // );
      });
      cy.visit('/');
    });
  });

  after(() => {
    mockDatabase.clear();
    // mockDatabase.restoreRTDB();
  });

  it('Select several the-things and apply an imitation', () => {
    cy.visit('/the-things/my');
    const myThingsPO = new MyThingsPageObjectCypress();
    myThingsPO.expectVisible();
    myThingsPO.applyImitation(theThings, imitation);
    cy.wrap(theThings).each((item: any) => {
      const theThing: TheThing = item;
      cy.visit(`/the-things/${theThing.id}`);
      // Expect no validation error for this theThing
      const imitationViewDogPO = new ImitationViewDogPageObjectCypress();
      imitationViewDogPO.expectVisibale();
      imitationViewDogPO.expectNoError();
      // Expect all required cells show
      const requiredCells = theThing.getCellsByNames(
        imitation.getRequiredCellIds()
      );
      imitationViewDogPO.expectCells(requiredCells);
    });
  });
});
