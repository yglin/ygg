import { sampleSize, values, pick, sum, sumBy, random } from 'lodash';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import {
  MinimalTourPlan,
  TourPlanFull,
  TourPlanFullWithPlays,
  MinimalTourPlanWithoutName
} from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  TheThingEditorPageObjectCypress,
  TheThingDataTablePageObjectCypress,
  MyThingsDataTablePageObjectCypress,
  TheThingViewPageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing } from '@ygg/the-thing/core';
import { Contact } from '@ygg/shared/omni-types/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  Purchase,
  RelationAddition,
  CellNameCharge,
  CellNamePrice,
  RelationNamePurchase,
  CellNameQuantity
} from '@ygg/shopping/core';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { MyThingsDataTableComponent } from 'libs/the-thing/ui/src/lib/the-thing/my-things-data-table/my-things-data-table.component';

const mockDatabase = new MockDatabase();
const siteNavigator = new SiteNavigator();
const selectPlays = sampleSize(SamplePlays, 2);
let tourPlanWithPlays: TheThing;
const tourPlanFull: TheThing = TourPlanFull;
const SampleTourPlans = [
  MinimalTourPlan.clone(),
  TourPlanFullWithPlays.clone()
];

const tourPlanBuilderPO = new TourPlanBuilderPageObjectCypress();
const tourPlanViewPO = new TourPlanViewPageObjectCypress();

describe('Tour-plan builder', () => {
  before(() => {
    tourPlanWithPlays = MinimalTourPlan.clone();
    tourPlanWithPlays.addRelations('體驗', selectPlays);
    login().then(user => {
      const SampleTheThings = SamplePlays.concat(SampleAdditions).concat(
        SampleTourPlans
      );
      cy.wrap(SampleTheThings).each((thing: any) => {
        thing.ownerId = user.id;
        mockDatabase.insert(
          `${TheThing.collection}/${thing.id}`,
          thing.toJSON()
        );
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    tourPlanBuilderPO.reset();
    siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    // Goto my-things page and delete all test things
    const myThingsPO = new MyThingsPageObjectCypress();
    siteNavigator.goto(['the-things', 'my'], myThingsPO);
    cy.wait(3000);
    myThingsPO.deleteAll();

    mockDatabase.clear();
    mockDatabase.restoreRTDB();
  });

  it('Build a tour-plan and check it out in admin page', () => {
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

    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.setName(MinimalTourPlan.name);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
    tourPlanBuilderPO.submit();

    // Expect the submitted tour-plan show up in administrator's list
    const tourPlanDataTablePO = new TheThingDataTablePageObjectCypress();
    siteNavigator.goto(['admin', 'tour-plans'], tourPlanDataTablePO);
    // tourPlanDataTablePO.expectTheThing(MinimalTourPlan);
    tourPlanDataTablePO.expectFirst(MinimalTourPlan);
    tourPlanDataTablePO.clickFirst();

    // Click the tour-plan to review it
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
  });

  it('A tour-plan without user input name should have default name', () => {
    // Set date and number of participants
    tourPlanBuilderPO.expectStep(1);
    const dateRange = MinimalTourPlanWithoutName.cells['預計出遊日期'].value;
    tourPlanBuilderPO.setDateRange(dateRange);
    const numParticipants =
      MinimalTourPlanWithoutName.cells['預計參加人數'].value;
    tourPlanBuilderPO.setNumParticipants(numParticipants);
    tourPlanBuilderPO.next();

    // Fill in contact info
    tourPlanBuilderPO.expectStep(2);
    tourPlanBuilderPO.setContact(
      MinimalTourPlanWithoutName.cells['聯絡資訊'].value
    );
    tourPlanBuilderPO.next();

    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.next();

    // Review final tour-plan, the name should be defaultName
    const defaultName = `深度遊趣${dateRange.days() + 1}日遊`;
    tourPlanBuilderPO.expectStep(5);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectName(defaultName);
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

    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.setName(MinimalTourPlan.name);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check required data fields
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(MinimalTourPlan);
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

    // Show cart of selected plays, here we just skip it
    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.setName(TourPlanFull.name);
    // Set optional data fields
    const optionalCells = ImitationTourPlan.getOptionalCellNames();
    tourPlanBuilderPO.theThingCellsEditorPO.updateValue(
      TourPlanFull.getCellsByNames(optionalCells)
    );
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull);
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check required data fields
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull);
  });

  it('Build a tour-plan with a few plays selected', () => {
    const playsWithoutAddition = SamplePlays.filter(
      play => !play.hasRelation(RelationAddition.name)
    );

    // Select plays, set date and number of participants
    tourPlanBuilderPO.expectStep(1);
    const dateRange = tourPlanWithPlays.cells['預計出遊日期'].value;
    tourPlanBuilderPO.setDateRange(dateRange);
    const numParticipants = tourPlanWithPlays.cells['預計參加人數'].value;
    tourPlanBuilderPO.setNumParticipants(numParticipants);
    tourPlanBuilderPO.selectPlays(playsWithoutAddition);
    tourPlanBuilderPO.next();

    // Fill in contact info
    tourPlanBuilderPO.expectStep(2);
    tourPlanBuilderPO.setContact(tourPlanWithPlays.cells['聯絡資訊'].value);
    tourPlanBuilderPO.next();

    // Show cart of selected plays, expect correct total price
    const purchases: Purchase[] = [];
    for (const play of playsWithoutAddition) {
      purchases.push(
        new Purchase({
          productId: play.id,
          quantity: numParticipants
        })
      );
    }
    const totalCharge: number = sumBy(
      playsWithoutAddition,
      (play: TheThing) => play.getCellValue(CellNameCharge) * numParticipants
    );
    // const singleCharge: number = Math.ceil(totalCharge / numParticipants);
    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.cartEditorPO.expectProducts(playsWithoutAddition);
    tourPlanBuilderPO.cartEditorPO.expectTotalCharge(totalCharge);
    tourPlanBuilderPO.next();

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.setName(tourPlanWithPlays.name);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(tourPlanWithPlays);
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(tourPlanWithPlays);
    tourPlanViewPO.purchaseListPO.expectPurchases(
      purchases.map(p => {
        return { productId: p.productId, quantity: p.quantity };
      })
    );
    tourPlanViewPO.purchaseListPO.expectTotalCharge(totalCharge);
  });

  it('Build a tour-plan with a few plays selected, and setup additions', () => {
    const playsWithAddition = SamplePlays.filter(play =>
      play.hasRelation(RelationAddition.name)
    );

    // Select plays, set date and number of participants
    tourPlanBuilderPO.expectStep(1);
    const dateRange = tourPlanWithPlays.cells['預計出遊日期'].value;
    tourPlanBuilderPO.setDateRange(dateRange);
    const numParticipants = tourPlanWithPlays.cells['預計參加人數'].value;
    tourPlanBuilderPO.setNumParticipants(numParticipants);
    tourPlanBuilderPO.selectPlays(playsWithAddition);
    tourPlanBuilderPO.next();

    // Fill in contact info
    tourPlanBuilderPO.expectStep(2);
    tourPlanBuilderPO.setContact(tourPlanWithPlays.cells['聯絡資訊'].value);
    tourPlanBuilderPO.next();

    // Show cart of selected plays, with additions, expect correct total price
    const additionPurchaseQuantity = random(3, 10);
    const purchases: Purchase[] = [];
    const products = playsWithAddition.concat(SampleAdditions);
    for (const play of playsWithAddition) {
      purchases.push(
        new Purchase({
          productId: play.id,
          price: play.getCellValue(CellNameCharge),
          quantity: numParticipants
        })
      );
    }
    for (const addition of SampleAdditions) {
      purchases.push(
        new Purchase({
          productId: addition.id,
          price: addition.getCellValue(CellNameCharge),
          quantity: additionPurchaseQuantity
        })
      );
    }
    const totalCharge: number = sumBy(
      purchases,
      (purchase: Purchase) => purchase.charge
    );

    // const singleCharge: number = Math.ceil(totalCharge / numParticipants);
    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.cartEditorPO.expectProducts(products);
    tourPlanBuilderPO.cartEditorPO.setQuantity(
      SampleAdditions[0].id,
      additionPurchaseQuantity
    );
    tourPlanBuilderPO.cartEditorPO.setQuantity(
      SampleAdditions[1].id,
      additionPurchaseQuantity
    );
    tourPlanBuilderPO.cartEditorPO.expectTotalCharge(totalCharge);
    // cy.pause();
    tourPlanBuilderPO.next();

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.setName(tourPlanWithPlays.name);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(tourPlanWithPlays);
    // cy.pause();
    tourPlanBuilderPO.submit();

    // Expect redirect to tour-plan view page, and check selected plays
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(tourPlanWithPlays);
    tourPlanViewPO.purchaseListPO.expectPurchases(
      purchases.map(p => {
        return { productId: p.productId, quantity: p.quantity };
      })
    );
    tourPlanViewPO.purchaseListPO.expectTotalCharge(totalCharge);
  });

  it('Click edit button in my-tour-plans page, should goto tour-plan-builder', () => {
    const myThingsPO = new MyThingsDataTablePageObjectCypress();
    siteNavigator.goto(['tour-plans', 'my'], myThingsPO);
    myThingsPO.theThingDataTablePO.expectTheThing(SampleTourPlans[0]);
    myThingsPO.theThingDataTablePO.gotoTheThingEdit(SampleTourPlans[0]);

    // Should redirect to tour-plan-builder
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.expectStep(1);
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.submit();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(SampleTourPlans[0]);
  });

  it('Edit exist tour-plan with full data', () => {
    const myThingsPO = new MyThingsDataTablePageObjectCypress();
    siteNavigator.goto(['tour-plans', 'my'], myThingsPO);
    myThingsPO.theThingDataTablePO.expectTheThing(SampleTourPlans[1]);
    myThingsPO.theThingDataTablePO.gotoTheThingEdit(SampleTourPlans[1]);

    // Should redirect to tour-plan-builder
    tourPlanBuilderPO.expectVisible();
    tourPlanBuilderPO.expectStep(1);
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.next();
    tourPlanBuilderPO.submit();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(SampleTourPlans[1]);

    tourPlanViewPO.purchaseListPO.expectPurchases(
      SampleTourPlans[1].getRelations(RelationNamePurchase).map(r => {
        return {
          productId: r.objectId,
          quantity: r.getCellValue(CellNameQuantity)
        };
      })
    );
  });
});
