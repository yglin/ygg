import { SiteNavigator } from '@ygg/playwhat/test';
import {
  TheThingFilterPageObjectCypress,
  TheThingFinderPageObjectCypress,
  TheThingListPageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import { TheThing } from '@ygg/the-thing/core';
import { login, MockDatabase, theMockDatabase } from '@ygg/shared/test/cypress';
import { TourViewPageObjectCypress } from '@ygg/playwhat/test';
import { samplePlays, sampleTour } from '../tour/sample-tour-birb';
// import { TemplateTour } from '@ygg/playwhat/core';

const siteNavigator = new SiteNavigator();

describe('Manage content in home page', () => {
  before(() => {
    login().then(user => {
      const things = [...samplePlays, sampleTour];
      cy.wrap(things).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(
          `${TheThing.collection}/${thing.id}`,
          thing
        );
      });
      cy.visit('/');
    });
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('Specify a tour to be exhibited in home page', () => {
    siteNavigator.goto(['admin', 'homepage']);
    cy.get('.exhibit-things button.add').click({ force: true });
    const theThingFinderDialogPO = new TheThingFinderPageObjectCypress();
    theThingFinderDialogPO.expectVisible();
    theThingFinderDialogPO.select(sampleTour);
    theThingFinderDialogPO.submit();
    const theThingListPO = new TheThingListPageObjectCypress();
    theThingListPO.expectTheThing(sampleTour);

    siteNavigator.goto(['home']);
    const tourViewPO = new TourViewPageObjectCypress();
    tourViewPO.expectVisible();
    tourViewPO.expectValue(sampleTour);
    tourViewPO.expectPlays(samplePlays);
  });
});
