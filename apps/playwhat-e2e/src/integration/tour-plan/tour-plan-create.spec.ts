import {
  CellNames,
  defaultTourPlanName,
  ImitationTourPlan
} from '@ygg/playwhat/core';
import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanViewPageObjectCypress,
  TourPlanPageObjectCypress
} from '@ygg/playwhat/test';
import { Contact } from '@ygg/shared/omni-types/core';
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
  logout,
  waitForLogin
} from '@ygg/shared/user/test';
import { ImitationOrder } from '@ygg/shopping/core';
import { TheThingCell, TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  SampleEquipments,
  SamplePlays,
  MinimumPlay
} from '../play/sample-plays';
import { MinimalTourPlan, TourPlanFull } from './sample-tour-plan';

describe('Tour-plan create', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments);

  const tourPlanPO = new TourPlanPageObjectCypress();
  const tourPlanAdminPO = new TourPlanAdminPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress(
    '',
    ImitationTourPlan
  );
  let currentUser: User;

  before(() => {
    login().then(user => {
      currentUser = user;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${thing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    waitForLogin();
    siteNavigator.goto(['tour-plans', 'create'], tourPlanPO);
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
    tourPlanPO.theThingPO.setValue(MinimalTourPlan);
    tourPlanPO.theThingPO.save(MinimalTourPlan);
    tourPlanPO.expectShowAsPage();
    tourPlanPO.theThingPO.expectValue(MinimalTourPlan);
  });

  it('A tour-plan without user input name should have default name', () => {
    const dateRangeCell = MinimalTourPlan.getCell(CellNames.dateRange);
    tourPlanPO.theThingPO.setCell(dateRangeCell);
    tourPlanPO.theThingPO.expectName(defaultTourPlanName(dateRangeCell.value));
  });

  it('Logged-in user can automatically fill contact info', () => {
    tourPlanPO.theThingPO.setCell(MinimalTourPlan.getCell(CellNames.dateRange));
    tourPlanPO.theThingPO.setCell(MinimalTourPlan.getCell(CellNames.numParticipants));
    const omniTypeViewControl = new OmniTypeViewControlPageObjectCypress(
      tourPlanPO.theThingPO.getSelectorForCell(CellNames.contact)
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
    tourPlanPO.theThingPO.setCell(MinimalTourPlan.getCell(CellNames.dateRange));
    tourPlanPO.theThingPO.setCell(MinimalTourPlan.getCell(CellNames.numParticipants));
    tourPlanPO.theThingPO.setCell(MinimalTourPlan.getCell(CellNames.contact));
    const cell = new TheThingCell({
      name: '兩顆子彈',
      type: 'text',
      value: '肚皮'
    });
    tourPlanPO.theThingPO.addCell(cell);
    tourPlanPO.theThingPO.addCell(cell);
    const emceePO = new EmceePageObjectCypress();
    emceePO.alert(`資料欄位 ${cell.name} 已存在`);
    cy.get(tourPlanPO.getSelectorForCell(cell.name)).should(
      'have.length',
      1
    );
  });

  it('Build a tour-plan plus includes all optional data fields', () => {
    tourPlanPO.theThingPO.setValue(TourPlanFull);
    tourPlanPO.theThingPO.save(TourPlanFull);
    tourPlanPO.expectShowAsPage();
    tourPlanPO.theThingPO.expectValue(TourPlanFull);
  });

  it('Can delete cells', () => {
    const optionalCells = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
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
    const tourPlan = MinimalTourPlan.clone();
    tourPlan.name = '測試遊程（儲存後顯示在我的遊程清單中）';
    tourPlanPO.theThingPO.setValue(tourPlan);
    tourPlanPO.theThingPO.save(tourPlan);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(tourPlan);
  });

  it('Require login when save', () => {
    logout();
    // // Logout will redirect user back to home, cause re-render of tour-plan-builder
    // // So we wait several seconds here for tour-plan-builder to be stable
    // cy.wait(3000);
    const tourPlan = MinimalTourPlan.clone();
    tourPlan.name = '測試遊程（需要登入才能儲存）';
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
