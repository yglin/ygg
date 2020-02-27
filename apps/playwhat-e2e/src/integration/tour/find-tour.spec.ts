import * as SampleTourJSON from './sample-tour-birb.json';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import {
  TheThingFilterPageObjectCypress,
  TheThingListPageObjectCypress,
} from '@ygg/the-thing/test';
import { TourViewPageObjectCypress } from '@ygg/playwhat/test';
import { SiteNavigator } from '../../support/site-navigator';
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
      sampleTour.ownerId = user.id;
      sampleTour.addRelations(relationPlay, plays);

      const stubTheThings = [sampleTour, ...plays];
      cy.wrap(stubTheThings).each((thing: any) => {
        mockDatabase.insert(
          `${TheThing.collection}/${thing.id}`,
          thing.toJSON()
        );
      });

      cy.visit('/');
    });
  });

  after(() => {
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
