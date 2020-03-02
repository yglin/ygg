import { SiteNavigator } from '@ygg/playwhat/test';
import {
  TheThingFilterPageObjectCypress,
  TheThingFinderPageObjectCypress,
  TheThingListPageObjectCypress
} from '@ygg/the-thing/test';
import { TheThing } from '@ygg/the-thing/core';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import { TourViewPageObjectCypress } from '@ygg/playwhat/test';
import { samplePlays, insertDatabase } from '../tour/sample-tour-birb';
import { TemplateTour } from '@ygg/playwhat/core';

const siteNavigator = new SiteNavigator();
const mockDatabase = new MockDatabase();
let sampleTour: TheThing;

describe('Manage content in home page', () => {
  before(() => {
    login().then(user => {
      cy.wrap(samplePlays).each((play: any) => {
        mockDatabase.insert(`${TheThing.collection}/${play.id}`, play.toJSON());
      });
      sampleTour = TemplateTour.clone();
      sampleTour.addRelations('體驗', samplePlays);
      mockDatabase.insert(
        `${TheThing.collection}/${sampleTour.id}`,
        sampleTour.toJSON()
      );
      cy.visit('/');
    });
  });

  after(() => {
    mockDatabase.clear();
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
