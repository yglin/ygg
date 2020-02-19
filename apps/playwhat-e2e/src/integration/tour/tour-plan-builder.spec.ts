import { sampleSize, values, pick } from 'lodash';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import { MinimalTourPlan, TourPlanFull } from './sample-tour-plan';
import { SamplePlays } from './sample-plays';
import {
  TheThingEditorPageObjectCypress,
  TheThingDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress
} from '../../page-objects/tour';
import { SiteNavigator } from '../../page-objects/site-navigator';
import { TheThing } from '@ygg/the-thing/core';
import { Contact } from '@ygg/shared/omni-types/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';

const mockDatabase = new MockDatabase();
const siteNavigator = new SiteNavigator();
const selectPlays = sampleSize(SamplePlays, 2);
let tourPlanWithPlays: TheThing;
const tourPlanFull: TheThing = TourPlanFull;
const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();

describe('What can we do in home page ?', () => {
  before(() => {
    tourPlanWithPlays = MinimalTourPlan.clone();
    tourPlanWithPlays.addRelations('體驗', selectPlays);
    login().then(() => {
      cy.wrap(SamplePlays).each((play: any) => {
        mockDatabase.insert(`${TheThing.collection}/${play.id}`, play.toJSON());
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    tourPlanBuilderPO.reset();
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Build a tour-plan with minimal required data fields: dateRange, numParticipants, contact', () => {
    // Set date and number of participants
    tourPlanBuilderPO.expectStep(1);
    const dateRange = MinimalTourPlan.cells['預計出遊日期'].value;
    tourPlanBuilderPO.setDateRange(dateRange);
    const numParticipants = MinimalTourPlan.cells['預計參加人數'].value;
    tourPlanBuilderPO.setNumParticipants(numParticipants);
    tourPlanBuilderPO.next();

    // Fill in contact info
    tourPlanBuilderPO.expectStep(2);
    tourPlanBuilderPO.setContact(MinimalTourPlan.cells['聯絡資訊'].value);
    tourPlanBuilderPO.next();

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(4);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
    tourPlanBuilderPO.submit();

    // Expect the submitted tour-plan show up in administrator's list
    const tourPlanDataTablePO = new TheThingDataTablePageObjectCypress();
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanDataTablePO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanDataTablePO.clickFirst();

    // Click the tour-plan to review it
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('Build a tour-plan with a few plays selected', () => {
    // Select plays, set date and number of participants
    tourPlanBuilderPO.expectStep(1);
    tourPlanBuilderPO.selectPlays(selectPlays);
    const dateRange = tourPlanWithPlays.cells['預計出遊日期'].value;
    tourPlanBuilderPO.setDateRange(dateRange);
    const numParticipants = tourPlanWithPlays.cells['預計參加人數'].value;
    tourPlanBuilderPO.setNumParticipants(numParticipants);
    tourPlanBuilderPO.next();

    // Fill in contact info
    tourPlanBuilderPO.expectStep(2);
    tourPlanBuilderPO.setContact(tourPlanWithPlays.cells['聯絡資訊'].value);
    tourPlanBuilderPO.next();

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(4);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(tourPlanWithPlays);
    tourPlanBuilderPO.submit();

    // Expect the submitted tour-plan show up in administrator's list
    const tourPlanDataTablePO = new TheThingDataTablePageObjectCypress();
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanDataTablePO);
    // tourPlanDataTablePO.expectTheThing(tourPlanWithPlays);
    tourPlanDataTablePO.clickFirst();

    // Click the tour-plan to review it
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(tourPlanWithPlays);
    tourPlanViewPO.expectPlays(selectPlays);
  });

  it('Build a tour-plan plus includes all optional data fields', () => {
    // Set date and number of participants
    tourPlanBuilderPO.expectStep(1);
    const dateRange = TourPlanFull.cells['預計出遊日期'].value;
    tourPlanBuilderPO.setDateRange(dateRange);
    const numParticipants = TourPlanFull.cells['預計參加人數'].value;
    tourPlanBuilderPO.setNumParticipants(numParticipants);
    tourPlanBuilderPO.next();

    // Fill in contact info
    tourPlanBuilderPO.expectStep(2);
    tourPlanBuilderPO.setContact(TourPlanFull.cells['聯絡資訊'].value);
    tourPlanBuilderPO.next();

    // Set optional data fields
    tourPlanBuilderPO.expectStep(3);
    const optionalCells = ImitationTourPlan.getOptionalCellNames();
    tourPlanBuilderPO.theThingCellsEditorPO.updateValue(values(pick(TourPlanFull.cells, optionalCells)));
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(4);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull);
    tourPlanBuilderPO.submit();

    // Expect the submitted tour-plan show up in administrator's list
    const tourPlanDataTablePO = new TheThingDataTablePageObjectCypress();
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanDataTablePO);
    // tourPlanDataTablePO.expectTheThing(TourPlanFull);
    tourPlanDataTablePO.clickFirst();

    // Click the tour-plan to review it
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull);
  });
});
