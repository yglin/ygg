import { SiteNavigator } from '../../page-objects/site-navigator';
import {
  TheThingFilterPageObjectCypress,
  TheThingFinderPageObjectCypress,
  TheThingListPageObjectCypress
} from '@ygg/the-thing/test';
import { TheThing } from "@ygg/the-thing/core";
import { login, MockDatabase } from "@ygg/shared/test/cypress";
import { TourViewPageObjectCypress } from '../../page-objects/tour';
import { sampleTour, samplePlays, insertDatabase } from "../tour/sample-tour-birb";

const siteNavigator = new SiteNavigator();
const mockDatabase = new MockDatabase();

describe('Manage content in home page', () => {
  before(() => {
    login().then(user => {
      insertDatabase(mockDatabase, user);
      cy.visit('/');
    });
  });

  after(() => {
    mockDatabase.clear();
  })
  
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
