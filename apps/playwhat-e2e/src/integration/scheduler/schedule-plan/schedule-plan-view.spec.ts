import { range, random, sample, sampleSize } from 'lodash';
import { SchedulePlanViewPageObjectCypress } from '../../../page-objects/scheduler';
import { Accommodation, Addition } from '@ygg/resource/core';
import { Document, MockDatabase } from '../../..//support/mock-database';
import { login } from '../../../page-objects/app.po';
import { SchedulePlan } from '@ygg/schedule/core';
import { SiteNavigator } from '../../../page-objects/site-navigator';
import { Play } from '@ygg/playwhat/play';
import { Purchase } from '@ygg/shopping/core';
import { AccommodationListPageObjectCypress } from '../../../page-objects/resource/accommodation';

describe('Schedule plan view', () => {
  const mockDatabase = new MockDatabase();
  const siteNavigator = new SiteNavigator();
  let testSchedulePlan: SchedulePlan;
  let testAccommodations: Accommodation[];
  let schedulePlanViewPO: SchedulePlanViewPageObjectCypress;
  let playsNoAdditions: Play[];
  let playsWithAdditions: Play[];

  before(() => {
    const documents: Document[] = [];
    const testPlays = [];
    playsNoAdditions = range(random(2, 5)).map(() =>
      Play.forge({
        numAdditions: 0
      })
    );
    testPlays.push(...playsNoAdditions);
    playsWithAdditions = range(random(1, 3)).map(() =>
      Play.forge({
        numAdditions: random(1, 4)
      })
    );
    testPlays.push(...playsWithAdditions);
    testPlays.forEach(play => {
      documents.push({ path: `plays/${play.id}`, data: play.toJSON() });
      play.additions.forEach(eq => {
        documents.push({
          path: `${Addition.collection}/${eq.id}`,
          data: eq.toJSON()
        });
      });
    });

    let purchases: Purchase[] = sampleSize(playsWithAdditions, 3).map(
      play =>
        new Purchase({
          product: play,
          quantity: random(10, 30)
        })
    );

    testSchedulePlan = SchedulePlan.forge({ purchases });
    documents.push({
      path: `schedule-plans/${testSchedulePlan.id}`,
      data: testSchedulePlan.toJSON()
    });
    testAccommodations = range(random(2, 5)).map(() => Accommodation.forge());
    testAccommodations.forEach(accommodation => {
      documents.push({
        path: `${accommodation.collection}/${accommodation.id}`,
        data: accommodation.toJSON()
      });
    });
    mockDatabase.insertDocuments(documents);
  });

  before(() => {
    cy.visit('/');
    login();
  });

  after(() => {
    mockDatabase.clear();
  });

  beforeEach(function() {
    siteNavigator.gotoSchedulePlanView(testSchedulePlan);
    schedulePlanViewPO = new SchedulePlanViewPageObjectCypress('');
  });

  it('Should show consist data', () => {
    schedulePlanViewPO.expectValue(testSchedulePlan);
  });

  it('Should show accommodation infos', () => {
    schedulePlanViewPO.expectAccommodations(testAccommodations);
  });

  it('Shoud redirect to accommodation first link when click on one', () => {
    const testAccommodation = sample(testAccommodations);
    const accommodationListPO = new AccommodationListPageObjectCypress(
      schedulePlanViewPO.getSelector('accommodations')
    );
    cy.get(
      accommodationListPO.getSelectorForAccommodation(testAccommodation)
    ).click({ force: true });
    cy.url({ timeout: 10000 }).should('eq', testAccommodation.links[0]);
  });
});
