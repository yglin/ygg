import { sampleSize, random } from 'lodash';
import { login, theMockDatabase, logout } from '@ygg/shared/test/cypress';
import { LoginDialogPageObjectCypress } from '@ygg/shared/user/test';
import {
  MinimalTourPlan,
  TourPlanFull,
  // TourPlanFullWithPlays,
  MinimalTourPlanWithoutName,
  TourPlanWithPlaysNoAddition,
  TourPlanWithPlaysAndAdditions
} from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  TheThingDataTablePageObjectCypress,
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress,
  TourPlanAdminPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationOrder } from '@ygg/shopping/core';
import { ContactControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { User } from '@ygg/shared/user/core';
import { Contact, DateRange } from '@ygg/shared/omni-types/core';
import { defaultTourPlanName } from '@ygg/playwhat/core';
import { randomBytes } from 'crypto';

describe('Tour-plan builder', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleAdditions);

  const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
  let currentUser: User;

  before(() => {
    login().then(user => {
      currentUser = user;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
    });
  });

  beforeEach(() => {
    cy.visit('/');
    tourPlanBuilderPO.reset();
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('A tour-plan without user input name should have default name', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlanWithoutName, { stopAtStep: 3 });
    tourPlanBuilderPO.tourPlanPreviewPO.expectName(
      defaultTourPlanName(MinimalTourPlanWithoutName)
    );
  });

  it('Logged-in user can automatically fill contact info', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlan, {
      stopAtStep: 2
    });
    const contactControlPO = new ContactControlPageObjectCypress();
    contactControlPO.importFromUser();
    contactControlPO.expectValue(new Contact().fromUser(currentUser));
  });

  it('Build a tour-plan with minimal required data fields: dateRange, numParticipants, contact', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlan);
    tourPlanBuilderPO.tourPlanPreviewPO.save();

    // Expect redirect to tour-plan view page, and check required data fields
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('Build a tour-plan plus includes all optional data fields', () => {
    tourPlanBuilderPO.setValue(TourPlanFull, {
      hasOptionalFields: true
    });
    tourPlanBuilderPO.tourPlanPreviewPO.save();

    // Expect redirect to tour-plan view page, and check required data fields
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanFull);
  });

  it('Build a tour-plan with a few plays selected', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysNoAddition);
    tourPlanBuilderPO.tourPlanPreviewPO.save();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanWithPlaysNoAddition);
  });

  it('Build a tour-plan with a few plays selected, and setup additions', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions);
    tourPlanBuilderPO.tourPlanPreviewPO.save();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  });

  it('Save tour-plan on leave page, restore on back', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions);
    // goto other page and back immediately
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
    tourPlanBuilderPO.reset();
    tourPlanBuilderPO.tourPlanPreviewPO.save();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  });

  it('Build a tour-plan and send it for application', () => {
    tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions);
    tourPlanBuilderPO.submitApplication();
    tourPlanViewPO.expectShowAsPage();

    // Expect the submitted tour-plan show up in administrator's list
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].expectTheThing(TourPlanWithPlaysAndAdditions);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].gotoTheThingView(TourPlanWithPlaysAndAdditions);

    // Click the tour-plan to review it
    tourPlanViewPO.expectShowAsPage();
    TourPlanWithPlaysAndAdditions.setState(
      ImitationOrder.stateName,
      ImitationOrder.states.applied
    );
    tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  });

  it('Require login when save', () => {
    logout().then(() => {
      // Logout will redirect user back to home, cause re-render of tour-plan-builder
      // So we wait several seconds here for tour-plan-builder to be stable
      cy.wait(3000);
      tourPlanBuilderPO.setValue(MinimalTourPlan);
      tourPlanBuilderPO.tourPlanPreviewPO.save();
      const loginDialogPO = new LoginDialogPageObjectCypress();
      loginDialogPO.expectVisible();
      login().then(() => {
        loginDialogPO.expectClosed();
        tourPlanViewPO.expectShowAsPage();
        // tourPlanViewPO.expectValue(MinimalTourPlan);
        siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
        myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
      });
    });
  });

  it('Can switch back to previous step', () => {
    tourPlanBuilderPO.setValue(MinimalTourPlan, { stopAtStep: 2 });
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.setValue(MinimalTourPlan, { stopAtStep: 3 });
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.prev();
    tourPlanBuilderPO.setValue(MinimalTourPlan);
    tourPlanBuilderPO.tourPlanPreviewPO.save();
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('Can change dateRange, numParticipants, and contact directly in preview', () => {
    const MinimalTourPlan2: TheThing = MinimalTourPlan.clone();
    const newDateRange = DateRange.forge();
    const newNumParticipants = random(100, 1000);
    const newContact = Contact.forge();
    MinimalTourPlan2.updateCellValues({
      預計出遊日期: newDateRange,
      預計參加人數: newNumParticipants,
      聯絡資訊: newContact
    });
    tourPlanBuilderPO.setValue(MinimalTourPlan);
    tourPlanBuilderPO.tourPlanPreviewPO.expectVisible();

    tourPlanBuilderPO.tourPlanPreviewPO.setCellValue(
      MinimalTourPlan2.getCell('預計出遊日期')
    );
    tourPlanBuilderPO.tourPlanPreviewPO.setCellValue(
      MinimalTourPlan2.getCell('預計參加人數')
    );
    tourPlanBuilderPO.tourPlanPreviewPO.setCellValue(
      MinimalTourPlan2.getCell('聯絡資訊')
    );
    tourPlanBuilderPO.tourPlanPreviewPO.save();
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(MinimalTourPlan2);
  });
});
