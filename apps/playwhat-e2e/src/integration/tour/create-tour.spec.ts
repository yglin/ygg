import * as SampleTourJSON from './sample-tour-birb.json';
import { TheThing } from '@ygg/the-thing/core';
import {
  MockDatabase,
  login,
  getCurrentUser,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import {
  TheThingEditorPageObjectCypress,
  getCreatedTheThingId,
  TheThingViewPageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import { TourViewPageObjectCypress, SiteNavigator } from '@ygg/playwhat/test';

const siteNavigator = new SiteNavigator();
const sampleTour = new TheThing().fromJSON(SampleTourJSON.tour);
const plays = SampleTourJSON.plays.map(playJSON =>
  new TheThing().fromJSON(playJSON)
);
const relationPlay = '體驗';

describe('Create a tour composed of plays', () => {
  before(() => {
    login().then(user => {
      cy.wrap(plays).each((play: any) => {
        play.ownerId = user.id;
        theMockDatabase.insert(
          `${TheThing.collection}/${play.id}`,
          play
        );
      });
      cy.visit('/');
    });
  });

  before(() => {});

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();

    theMockDatabase.clear();
  });

  it('Create sample tour and check data consistency', () => {
    cy.visit('/the-things/create');
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    // cy.log(sampleTour.view);
    theThingEditorPO.setValue(sampleTour);
    cy.wrap(plays).each((play: any) => {
      theThingEditorPO.addRelationExist(relationPlay, play);
    });
    theThingEditorPO.submit();
    const tourViewPO = new TourViewPageObjectCypress();
    tourViewPO.expectVisible();
    tourViewPO.expectValue(sampleTour);
    // getCurrentUser().then(user => tourViewPO.expectOwner(user));
    tourViewPO.expectPlays(plays);
  });
});
