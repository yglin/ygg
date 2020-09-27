import {
  defaultTourPlanName,
  ImitationTourPlan,
  ImitationTourPlanCellDefines
} from '@ygg/playwhat/core';
import { SiteNavigator, TourPlanPageObjectCypress } from '@ygg/playwhat/test';
import { Contact, OmniTypes } from '@ygg/shared/omni-types/core';
import {
  ContactControlPageObjectCypress,
  OmniTypeViewControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import {
  LoginDialogPageObjectCypress,
  loginTestUser,
  logout,
  testUsers,
  waitForLogin
} from '@ygg/shared/user/test';
import { TheThingCell } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { beforeAll } from '../../support/before-all';
import { SampleEquipments, SamplePlays } from '../play/sample-plays';
import { MinimalTourPlan, TourPlanFull } from './sample-tour-plan';

describe('Tour-plan create', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments);

  const tourPlanPO = new TourPlanPageObjectCypress();
  // const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  const me: User = testUsers[0];

  before(() => {
    beforeAll();
    cy.wrap(SampleThings).each((thing: any) => {
      thing.ownerId = me.id;
      theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(me);
  });

  // beforeEach(() => {
  //   siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
  //   // tourPlanBuilderPO.reset();
  //   // siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  // });

  after(() => {
    // // Goto my-things page and delete previously created things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('State of just created tour-plan should be "new"', () => {
    siteNavigator.goto([ImitationTourPlan.routePath, 'create']);
    tourPlanPO.expectVisible();
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.new);
  });

  it('Build a tour-plan with minimal required data fields: dateRange, numParticipants, contact', () => {
    tourPlanPO.theThingPO.setValue(MinimalTourPlan);
    tourPlanPO.theThingPO.save(MinimalTourPlan);
    tourPlanPO.expectShowAsPage();
    tourPlanPO.theThingPO.expectValue(MinimalTourPlan);
  });

  it('State of saved tourPlan should be "editing"', () => {
    tourPlanPO.theThingPO.expectState(ImitationTourPlan.states.editing);
  });

  it('A tour-plan without user input name should have default name', () => {
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    const dateRangeCell = MinimalTourPlan.getCell(
      ImitationTourPlanCellDefines.dateRange.id
    );
    tourPlanPO.theThingPO.setCell(dateRangeCell);
    tourPlanPO.theThingPO.expectName(defaultTourPlanName(dateRangeCell.value));
  });

  it('Logged-in user can automatically fill contact info', () => {
    tourPlanPO.theThingPO.setCell(
      MinimalTourPlan.getCell(ImitationTourPlanCellDefines.dateRange.id)
    );
    tourPlanPO.theThingPO.setCell(
      MinimalTourPlan.getCell(ImitationTourPlanCellDefines.numParticipants.id)
    );
    const omniTypeViewControl = new OmniTypeViewControlPageObjectCypress(
      tourPlanPO.theThingPO.getSelectorForCell(
        ImitationTourPlanCellDefines.contact.id
      )
    );
    omniTypeViewControl.openControl();
    const dialogPO = new YggDialogPageObjectCypress();
    const contactControlPO = new ContactControlPageObjectCypress(
      dialogPO.getSelector()
    );
    contactControlPO.importFromUser();
    contactControlPO.expectValue(new Contact().fromUser(me));
    dialogPO.confirm();
    omniTypeViewControl.expectValue('contact', new Contact().fromUser(me));
  });

  it('Can not add duplicate named cell', () => {
    tourPlanPO.theThingPO.setCell(
      MinimalTourPlan.getCell(ImitationTourPlanCellDefines.dateRange.id)
    );
    tourPlanPO.theThingPO.setCell(
      MinimalTourPlan.getCell(ImitationTourPlanCellDefines.numParticipants.id)
    );
    tourPlanPO.theThingPO.setCell(
      MinimalTourPlan.getCell(ImitationTourPlanCellDefines.contact.id)
    );
    const cell = new TheThingCell({
      id: '兩顆子彈',
      label: '兩顆子彈',
      type: 'text',
      value: '肚皮'
    });
    tourPlanPO.theThingPO.addCell(cell);
    tourPlanPO.theThingPO.addCell(cell);
    const emceePO = new EmceePageObjectCypress();
    emceePO.alert(
      `資料欄位 ${cell.label}(${OmniTypes[cell.type].label}) 已存在`
    );
    cy.get(tourPlanPO.getSelectorForCell(cell.id)).should('have.length', 1);
  });

  it('Build a tour-plan plus includes all optional data fields', () => {
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    tourPlanPO.theThingPO.setValue(TourPlanFull);
    tourPlanPO.theThingPO.save(TourPlanFull);
    tourPlanPO.expectShowAsPage();
    tourPlanPO.theThingPO.expectValue(TourPlanFull);
  });

  it('Can delete cells', () => {
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    const optionalCells = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellIds()
    );
    tourPlanPO.theThingPO.setValue(MinimalTourPlan);
    cy.wrap(optionalCells).each((cell: TheThingCell) => {
      tourPlanPO.theThingPO.addCell(cell);
      tourPlanPO.theThingPO.expectCell(cell);
    });
    cy.wrap(optionalCells).each((cell: TheThingCell) => {
      tourPlanPO.theThingPO.deleteCell(cell);
      tourPlanPO.theThingPO.expectNoCell(cell);
    });
    tourPlanPO.theThingPO.save(MinimalTourPlan);
    tourPlanPO.expectShowAsPage();
    cy.wrap(optionalCells).each((cell: TheThingCell) => {
      tourPlanPO.theThingPO.expectNoCell(cell);
    });
  });

  it('Save tour-plan on leave page, restore on back', () => {
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    tourPlanPO.theThingPO.setValue(TourPlanFull);
    // goto other page and back immediately
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    tourPlanPO.theThingPO.save(TourPlanFull);

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanPO.expectShowAsPage();
    tourPlanPO.theThingPO.expectValue(TourPlanFull);

    // After save, reset tour-plan
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    tourPlanPO.theThingPO.expectFreshNew();
  });

  it('Show saved tour-plan in /tour-plans/my', () => {
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    const tourPlan = MinimalTourPlan.clone();
    tourPlan.name = `測試遊程（儲存後顯示在我的遊程清單中）_${Date.now()}`;
    tourPlanPO.theThingPO.setValue(tourPlan);
    tourPlanPO.theThingPO.save(tourPlan);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(tourPlan);
  });

  it('Require login when save', () => {
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    logout();
    // // Logout will redirect user back to home, cause re-render of tour-plan-builder
    // // So we wait several seconds here for tour-plan-builder to be stable
    // cy.wait(3000);
    const tourPlan = MinimalTourPlan.clone();
    tourPlan.name = `測試遊程（需要登入才能儲存）_${Date.now()}`;
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
    tourPlanPO.theThingPO.setValue(tourPlan);
    tourPlanPO.theThingPO.clickSave();
    const loginDialogPO = new LoginDialogPageObjectCypress();
    loginDialogPO.expectVisible();
    login();
    loginDialogPO.expectClosed();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`確定要儲存 ${tourPlan.name} ？`);
    emceePO.alert(`已成功儲存 ${tourPlan.name}`);
    // tourPlanPO.theThingPO.expectValue(MinimalTourPlan);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(tourPlan);
  });
});
