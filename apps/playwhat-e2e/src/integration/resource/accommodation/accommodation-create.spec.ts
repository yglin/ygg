import { last } from "lodash";
import { login } from '../../../page-objects/app.po';
import { SiteNavigator } from "../../../page-objects/site-navigator";
import { MockDatabase } from "../../../support/mock-database";
import { AccommodationControlPageObjectCypress, AccommodationViewPageObjectCypress } from "../../../page-objects/resource/accommodation";
import { Accommodation } from "@ygg/resource/core";

describe('Create accommodation', () => {
  const mockDatabase = new MockDatabase();
  const siteNavigator = new SiteNavigator();
  const accommodationControlPO = new AccommodationControlPageObjectCypress('');
  const accommodationViewPO = new AccommodationViewPageObjectCypress('');
  const testAccommodation = Accommodation.forge();

  before(() => {
    cy.visit('/');
    login();
  });

  after(() => {
    mockDatabase.clear();
  });

  it('Should submit consistent data', () => {
    siteNavigator.goto(['accommodations', 'new']);
    accommodationControlPO.setValue(testAccommodation);
    accommodationControlPO.submit();
    cy.url({timeout: 10000}).should('not.match', /accommodations\/new/);
    cy.location('pathname').then((pathnames: any) => {
      const id = last((pathnames as string).split('/'));
      testAccommodation.id = id;
      mockDatabase.pushDocument({
        path: `${testAccommodation.collection}/${id}`,
        data: testAccommodation.toJSON()
      });
      accommodationViewPO.expectValue(testAccommodation);
    });
  });
});
