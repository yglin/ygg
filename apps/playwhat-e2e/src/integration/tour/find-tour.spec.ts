import * as SampleTourJSON from './sample-tour-birb.json';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import { TheThingFilterPageObjectCypress, MyThingsPageObjectCypress } from '@ygg/the-thing/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';

const siteNavigator = new SiteNavigator();
const mockDatabase = new MockDatabase();
const sampleTour = new TheThing().fromJSON(SampleTourJSON.tour);
const plays = SampleTourJSON.plays.map(playJSON =>
  new TheThing().fromJSON(playJSON)
);
const relationPlay = '體驗';

describe('Find tours in my things', () => {
  before(() => {
    login().then(user => {
      sampleTour.addRelations(relationPlay, plays);

      const stubTheThings = [sampleTour, ...plays];
      cy.wrap(stubTheThings).each((thing: any) => {
        thing.ownerId = user.id;
        mockDatabase.insert(
          `${TheThing.collection}/${thing.id}`,
          thing.toJSON()
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

    mockDatabase.clear();
  });

  it('Go to my the-things page and search for the sample tour', () => {
    siteNavigator.goto(['the-things', 'my']);
    const theThingFilterPO = new TheThingFilterPageObjectCypress();
    const filter = new TheThingFilter({
      tags: sampleTour.tags.toIDArray(),
      keywordName: sampleTour.name
    });
    theThingFilterPO.setFilter(filter);
    const theThingListPO = new ImageThumbnailListPageObjectCypress();
    theThingListPO.expectItem(sampleTour);
    // theThingListPO.clickItemLink(sampleTour);
    // const tourViewPO = new TourViewPageObjectCypress();
    // tourViewPO.expectVisible();
    // tourViewPO.expectValue(sampleTour);
    // tourViewPO.expectPlays(plays);
  });
});
