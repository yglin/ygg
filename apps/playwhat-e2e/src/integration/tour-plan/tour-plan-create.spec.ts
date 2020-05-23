import { sampleSize, random } from 'lodash';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  LoginDialogPageObjectCypress,
  waitForLogin,
  logout
} from '@ygg/shared/user/test';
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
  TourPlanAdminPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing, TheThingCell, TheThingRelation } from '@ygg/the-thing/core';
import {
  ImitationOrder,
  Purchase,
  RelationNamePurchase
} from '@ygg/shopping/core';
import {
  ContactControlPageObjectCypress,
  OmniTypeViewControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { User } from '@ygg/shared/user/core';
import { Contact, DateRange } from '@ygg/shared/omni-types/core';
import {
  defaultTourPlanName,
  CellNames,
  ImitationTourPlan,
  ImitationPlay
} from '@ygg/playwhat/core';
import { randomBytes } from 'crypto';
import {
  YggDialogPageObjectCypress,
  EmceePageObjectCypress
} from '@ygg/shared/ui/test';
import { IPurchasePack } from '@ygg/shopping/ui';

describe('Tour-plan builder', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleAdditions);

  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
  let currentUser: User;

  before(() => {
    login().then(user => {
      currentUser = user;
      // cy.wrap(SampleThings).each((thing: any) => {
      //   thing.ownerId = user.id;
      //   theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      // });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    waitForLogin();
    siteNavigator.goto(['tour-plans', 'create'], tourPlanViewPO);
    // tourPlanBuilderPO.reset();
    // siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    // Goto my-things page and delete previously created things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('Build a tour-plan with minimal required data fields: dateRange, numParticipants, contact', () => {
    tourPlanViewPO.setValue(MinimalTourPlan, { freshNew: true });
    tourPlanViewPO.save(MinimalTourPlan);
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('A tour-plan without user input name should have default name', () => {
    const dateRangeCell = MinimalTourPlan.getCell(CellNames.dateRange);
    tourPlanViewPO.setCell(dateRangeCell);
    tourPlanViewPO.expectName(defaultTourPlanName(dateRangeCell.value));
  });

  it('Logged-in user can automatically fill contact info', () => {
    tourPlanViewPO.setCell(MinimalTourPlan.getCell(CellNames.dateRange));
    tourPlanViewPO.setCell(MinimalTourPlan.getCell(CellNames.numParticipants));
    const omniTypeViewControl = new OmniTypeViewControlPageObjectCypress(
      tourPlanViewPO.getSelectorForCell(CellNames.contact)
    );
    omniTypeViewControl.openControl();
    const dialogPO = new YggDialogPageObjectCypress();
    const contactControlPO = new ContactControlPageObjectCypress(
      dialogPO.getSelector()
    );
    contactControlPO.importFromUser();
    contactControlPO.expectValue(new Contact().fromUser(currentUser));
    dialogPO.confirm();
    omniTypeViewControl.expectValue(
      'contact',
      new Contact().fromUser(currentUser)
    );
  });

  it('Can not add duplicate named cell', () => {
    tourPlanViewPO.setCell(MinimalTourPlan.getCell(CellNames.dateRange));
    tourPlanViewPO.setCell(MinimalTourPlan.getCell(CellNames.numParticipants));
    tourPlanViewPO.setCell(MinimalTourPlan.getCell(CellNames.contact));
    const cell = new TheThingCell({
      name: '兩顆子彈',
      type: 'text',
      value: '肚皮'
    });
    tourPlanViewPO.addCell(cell);
    tourPlanViewPO.addCell(cell);
    const emceePO = new EmceePageObjectCypress();
    emceePO.alert(`資料欄位 ${cell.name} 已存在`);
    cy.get(tourPlanViewPO.getSelectorForCell(cell.name)).should(
      'have.length',
      1
    );
  });

  it('Build a tour-plan plus includes all optional data fields', () => {
    // const optionalCells = TourPlanFull.getCellsByNames(
    //   ImitationTourPlan.getOptionalCellNames()
    // );
    tourPlanViewPO.setValue(TourPlanFull, {
      freshNew: true
    });
    tourPlanViewPO.save(TourPlanFull);
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanFull);
  });

  it('Can delete cells', () => {
    const optionalCells = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    tourPlanViewPO.setValue(MinimalTourPlan, {
      freshNew: true
    });
    for (const cell of optionalCells) {
      tourPlanViewPO.addCell(cell);
      tourPlanViewPO.expectCell(cell);
    }
    for (const cell of optionalCells) {
      tourPlanViewPO.deleteCell(cell);
      tourPlanViewPO.expectNoCell(cell);
    }
    tourPlanViewPO.save(MinimalTourPlan);
    tourPlanViewPO.expectShowAsPage();
    for (const cell of optionalCells) {
      tourPlanViewPO.expectNoCell(cell);
    }
  });

  it('Save tour-plan on leave page, restore on back', () => {
    tourPlanViewPO.setValue(TourPlanFull, { freshNew: true });
    // goto other page and back immediately
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    siteNavigator.goto(['tour-plans', 'create'], tourPlanViewPO);
    tourPlanViewPO.save(TourPlanFull);

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectShowAsPage();
    tourPlanViewPO.expectValue(TourPlanFull);

    // After save, reset tour-plan
    siteNavigator.goto(['tour-plans', 'create'], tourPlanViewPO);
    tourPlanViewPO.expectFreshNew();
  });

  it('Show saved tour-plan in /tour-plans/my', () => {
    tourPlanViewPO.setValue(MinimalTourPlan);
    tourPlanViewPO.save(MinimalTourPlan);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
  });

  it('Require login when save', () => {
    logout();
    // // Logout will redirect user back to home, cause re-render of tour-plan-builder
    // // So we wait several seconds here for tour-plan-builder to be stable
    // cy.wait(3000);
    siteNavigator.goto(['tour-plans', 'create'], tourPlanViewPO);
    tourPlanViewPO.setValue(MinimalTourPlan);
    tourPlanViewPO.issueSave(MinimalTourPlan);
    const loginDialogPO = new LoginDialogPageObjectCypress();
    loginDialogPO.expectVisible();
    login();
    loginDialogPO.expectClosed();
    tourPlanViewPO.sendApplication(false);
    tourPlanViewPO.alertSaved(MinimalTourPlan);
    tourPlanViewPO.expectShowAsPage();
    // tourPlanViewPO.expectValue(MinimalTourPlan);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
  });

  it('Save a tour-plan and send it for application as well', () => {
    const MinimalTourPlan2 = MinimalTourPlan.clone();
    MinimalTourPlan2.name = '測試遊程(儲存順便送出申請)';
    tourPlanViewPO.setValue(MinimalTourPlan2);
    tourPlanViewPO.save(MinimalTourPlan2, {
      freshNew: true,
      sendApplication: true
    });
    tourPlanViewPO.expectShowAsPage();

    // Expect the submitted tour-plan show up in administrator's list
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanAdminPO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanAdminPO.theThingDataTables[
      ImitationOrder.states.applied.name
    ].expectTheThing(MinimalTourPlan2);
  });
});
