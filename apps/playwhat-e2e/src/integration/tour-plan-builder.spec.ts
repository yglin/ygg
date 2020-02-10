import { sampleSize } from "lodash";
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import { MinimalTourPlan } from './tour/sample-tour-plan';
import { SamplePlays } from './tour/sample-plays';
import { TheThingEditorPageObjectCypress } from '@ygg/the-thing/test';
import { TourPlanViewPageObjectCypress } from '../page-objects/tour';
import { SiteNavigator } from '../page-objects/site-navigator';
import { TheThing } from '@ygg/the-thing/core';

const mockDatabase = new MockDatabase();
const siteNavigator = new SiteNavigator();
const selectPlays = sampleSize(SamplePlays, 2);

describe('What can we do in home page ?', () => {
  before(() => {
    MinimalTourPlan.addRelations('體驗', selectPlays);
    login().then(() => {
      cy.wrap(SamplePlays).each((play: any) => {
        mockDatabase.insert(`${TheThing.collection}/${play.id}`, play.toJSON());
      });
      cy.visit('/');
    });
  });

  after(() => {
    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Pick a few plays, set dates and number of participants, fill in contact info, then submit a tour-plan', () => {
    const tourPlanBuilderStepPO = new TourPlanBuilderStepPageObjectCypress();
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderStepPO.expectVisible);
    // Select plays, set date and number of participants
    tourPlanBuilderStepPO.expectStep(1);
    tourPlanBuilderStepPO.selectPlays(MinimalTourPlan.relations['體驗']);
    const dateRange = MinimalTourPlan.cells['預計出遊日期'];
    tourPlanBuilderStepPO.setDateRange(dateRange);
    const numParticipants = MinimalTourPlan.cells['預計參加人數'];
    tourPlanBuilderStepPO.setNumParticipants(numParticipants);
    tourPlanBuilderStepPO.next();

    // Fill in contact info
    tourPlanBuilderStepPO.expectStep(2);
    const contactControlPO = new ContactControlPageObjectCypress();
    contactControlPO.expectVisible();
    contactControlPO.setValue(MinimalTourPlan.cells['聯絡資訊']);
    tourPlanBuilderStepPO.next();

    // Show optional data fields of a tour-plan, but we skip here
    tourPlanBuilderStepPO.expectStep(3);
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    tourPlanBuilderStepPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderStepPO.expectStep(4);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
    tourPlanBuilderStepPO.next();

    // Expect the submitted tour-plan show up in administrator's list
    siteNavigator.goto(['admin', 'tour-plans']);
    const tourPlanDataTablePO = new TourPlanDataTablePageObjectCypress();
    tourPlanDataTablePO.expectVisible();
    tourPlanDataTablePO.expectTourPlan(MinimalTourPlan);
    tourPlanDataTablePO.clickTourPlan(MinimalTourPlan);
    // Click the tour-plan to review it
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });
});
