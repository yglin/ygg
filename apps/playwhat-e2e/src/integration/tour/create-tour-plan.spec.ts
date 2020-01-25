import { ImitationTemplatesPath } from '@ygg/the-thing/core';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import { TourPlanViewPageObjectCypress } from '../../page-objects/tour';
import { TheThingEditorPageObjectCypress } from '@ygg/the-thing/test';
import { SampleTourPlan } from './sample-tour-plan';
import { TourPlanTemplate } from './tour-plan-template';

const siteNavigator = new SiteNavigator();
const mockDatabase = new MockDatabase();
const imitationId = 'tour-plan';

describe('Create tour-plan', () => {
  before(() => {
    login().then(() => {
      mockDatabase.insertRTDB(
        `${ImitationTemplatesPath}/${imitationId}`,
        TourPlanTemplate.toJSON()
      )
      .then(() => {
        cy.visit('/');
      });
    });
  });

  after(() => {
    mockDatabase.clear();
  });

  it("Create a tour-plan from copy template", () => {
    // siteNavigator.goto(['the-things', 'create', 'tour-plan']);
    cy.visit('/the-things/create/tour-plan');
    // cy.pause();
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    // cy.pause();
    theThingEditorPO.extendValue(SampleTourPlan);
    theThingEditorPO.submit();
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(SampleTourPlan);
  });


});
