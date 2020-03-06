import { sampleSize, values, pick, sum, sumBy, random } from 'lodash';
import { MockDatabase, login } from '@ygg/shared/test/cypress';
import { MinimalTourPlan, TourPlanFull } from './sample-tour-plan';
import { SamplePlays, SampleAdditions } from '../play/sample-plays';
import {
  TheThingEditorPageObjectCypress,
  TheThingDataTablePageObjectCypress
} from '@ygg/the-thing/test';
import {
  TourPlanViewPageObjectCypress,
  TourPlanBuilderPageObjectCypress
} from '@ygg/playwhat/test';
import { SiteNavigator } from '@ygg/playwhat/test';
import { TheThing } from '@ygg/the-thing/core';
import { Contact } from '@ygg/shared/omni-types/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { Purchase, RelationAddition, CellNameCharge } from '@ygg/shopping/core';

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
      const SampleTheThings = SamplePlays.concat(SampleAdditions);
      cy.wrap(SampleTheThings).each((thing: any) => {
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

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(3);
    tourPlanBuilderPO.next();

    // Show cart of selected plays, here we just skip it
    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
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

    // Show cart of selected plays, here we just skip it
    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
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

    // Set optional data fields
    tourPlanBuilderPO.expectStep(3);
    const optionalCells = ImitationTourPlan.getOptionalCellNames();
    tourPlanBuilderPO.theThingCellsEditorPO.updateValue(
      TourPlanFull.getCellsByNames(optionalCells)
    );
    tourPlanBuilderPO.next();

    // Show cart of selected plays, here we just skip it
    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
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

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(3);
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
    tourPlanBuilderPO.expectStep(4);
    tourPlanBuilderPO.cartEditorPO.expectProducts(playsWithoutAddition);
    tourPlanBuilderPO.cartEditorPO.expectTotalCharge(totalCharge);
    tourPlanBuilderPO.next();

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
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

    // Show optional data fields of a tour-plan, here we just skip it
    tourPlanBuilderPO.expectStep(3);
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
    tourPlanBuilderPO.expectStep(4);
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

    // Review final tour-plan and submit it
    tourPlanBuilderPO.expectStep(5);
    const tourPlanViewPO = new TourPlanViewPageObjectCypress();
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
});
