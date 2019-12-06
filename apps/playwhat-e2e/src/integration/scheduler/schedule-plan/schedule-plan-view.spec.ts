import { range, random } from 'lodash';
import { SchedulePlanViewPageObjectCypress } from '../../../page-objects/scheduler';
import { Accommodation } from '@ygg/resource/core';
import { Document, MockDatabase } from '../../..//support/mock-database';
import { login } from '../../../page-objects/app.po';
import { SchedulePlan } from '@ygg/schedule/core';
import { SiteNavigator } from '../../../page-objects/site-navigator';

describe('Schedule plan view', () => {
  const mockDatabase = new MockDatabase();
  const siteNavigator = new SiteNavigator();
  let testSchedulePlan: SchedulePlan;
  let testAccommodations: Accommodation[];

  before(() => {
    const documents: Document[] = [];
    testSchedulePlan = SchedulePlan.forge();
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

  it('Should show accommodation infos', () => {
    siteNavigator.gotoSchedulePlanView(testSchedulePlan);
    const schedulePlanViewPO = new SchedulePlanViewPageObjectCypress('');
    schedulePlanViewPO.expectAccommodations(testAccommodations);
  });
});
