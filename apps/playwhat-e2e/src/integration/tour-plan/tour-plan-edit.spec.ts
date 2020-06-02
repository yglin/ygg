// import { sampleSize, values, pick, sum, sumBy, random, find } from 'lodash';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import {
  PlayViewPageObjectCypress,
  SiteNavigator,
  TourPlanViewPageObjectCypress
} from '@ygg/playwhat/test';
import { login, logout, theMockDatabase } from '@ygg/shared/test/cypress';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import {
  Purchase,
  RelationAddition,
  RelationPurchase
} from '@ygg/shopping/core';
import { ShoppingCartEditorPageObjectCypress } from '@ygg/shopping/test';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { MyThingsDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { chunk, find, isEmpty, sum } from 'lodash';
import {
  PlaysWithEquipment,
  SampleEquipments,
  SamplePlays
} from '../play/sample-plays';
import {
  MinimalTourPlan,
  TourPlanFull,
  TourPlanWithPlaysAndAdditions,
  TourPlanWithPlaysNoAddition
} from './sample-tour-plan';

describe('Edit exist tour-plans from my-tour-plans page', () => {
  const siteNavigator = new SiteNavigator();
  const SampleTourPlans = [
    MinimalTourPlan,
    TourPlanFull,
    TourPlanWithPlaysNoAddition
  ];
  const SampleThings = SamplePlays.concat(SampleEquipments).concat(
    SampleTourPlans
  );

  const cartPO = new ShoppingCartEditorPageObjectCypress();
  const imageThumbnailListPO = new ImageThumbnailListPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const myTourPlansPO = new MyThingsDataTablePageObjectCypress();

  before(() => {
    login().then(user => {
      MinimalTourPlan.ownerId = user.id;
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    // login().then(user => {
    //   // MinimalTourPlan.ownerId = user.id;
    //   cy.wrap(SampleThings).each((thing: any) => {
    //     thing.ownerId = user.id;
    //     theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    //   });
    // });
    // Reset MinimalTourPlan
    theMockDatabase.insert(
      `${TheThing.collection}/${MinimalTourPlan.id}`,
      MinimalTourPlan
    );
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.expectTheThing(MinimalTourPlan);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(MinimalTourPlan);
    tourPlanViewPO.expectVisible();
    // cy.visit('/');
  });

  // afterEach(() => {
  //   theMockDatabase.clear();
  // });

  after(() => {
    // // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();

    theMockDatabase.clear();
  });

  it('Edit exist tour-plan with full data', () => {
    tourPlanViewPO.expectVisible();
    const newCells = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    tourPlanViewPO.setValue(TourPlanFull, { newCells });
    tourPlanViewPO.save(TourPlanFull);
    tourPlanViewPO.expectValue(TourPlanFull);
  });

  it('Edit exist tour-plan with purchasing plays and additions', () => {
    const resultTourPlan = MinimalTourPlan.clone();
    resultTourPlan.name = '測試遊程修改(加購體驗)';
    const purchaseRelations = TourPlanWithPlaysAndAdditions.getRelations(
      RelationPurchase.name
    );
    const purchases: Purchase[] = purchaseRelations.map(r =>
      Purchase.fromRelation(r)
    );
    const totalCharge = sum(purchases.map(p => p.charge));
    const purchasedPlays: TheThing[] = PlaysWithEquipment;

    cy.wrap(purchasedPlays).each((play: TheThing) => {
      const playPurchases: Purchase[] = [];
      playPurchases.push(find(purchases, p => p.productId === play.id));
      const additionRelations = play.getRelations(RelationAddition.name);
      if (!isEmpty(additionRelations)) {
        for (const ar of additionRelations) {
          playPurchases.push(find(purchases, p => p.productId === ar.objectId));
        }
      }
      siteNavigator.goto();
      const playThumbnailPO = imageThumbnailListPO.getItemPageObject(play);
      playThumbnailPO.clickLink();
      const playViewPO = new PlayViewPageObjectCypress();
      playViewPO.expectVisible();
      playViewPO.purchase(playPurchases);
    });

    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.submit();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.setValue(resultTourPlan);
    tourPlanViewPO.save(resultTourPlan);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(resultTourPlan);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(resultTourPlan);
    tourPlanViewPO.expectPurchases(purchases);
    tourPlanViewPO.expectTotalCharge(totalCharge);
  });

  it('Remove purchases', () => {
    const purchaseRelations = TourPlanWithPlaysNoAddition.getRelations(
      RelationPurchase.name
    );
    const [toBeRemoved, remains] = chunk(purchaseRelations, 2);
    const removePurchases = toBeRemoved.map(pr => Purchase.fromRelation(pr));
    const remainPurchases = remains.map(pr => Purchase.fromRelation(pr));
    const totalCharge = sum(remainPurchases.map(p => p.charge));
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanWithPlaysNoAddition
    );
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.importToCart();
    cartPO.expectVisible();
    cy.wrap(removePurchases).each((p: Purchase) => {
      cartPO.removePurchase(p);
    });
    cartPO.submit();
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.save(TourPlanWithPlaysNoAddition);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(
      TourPlanWithPlaysNoAddition
    );
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectPurchases(remainPurchases);
    tourPlanViewPO.expectTotalCharge(totalCharge);
  });

  it('Edit tour-plan, remove optional cells', () => {
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanFull);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectValue(TourPlanFull);
    const cells2BDel: TheThingCell[] = TourPlanFull.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    for (const cell of cells2BDel) {
      tourPlanViewPO.deleteCell(cell);
    }
    tourPlanViewPO.save(TourPlanFull);

    // const resultTourPlan = TourPlanFull.clone();
    // resultTourPlan.deleteCells(cells2BDel);
    siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
    myTourPlansPO.theThingDataTablePO.gotoTheThingView(TourPlanFull);
    tourPlanViewPO.expectVisible();
    tourPlanViewPO.expectNoCells(cells2BDel);
  });

  it('Can not modify if not owner', () => {
    logout().then(() => {
      cy.visit(`${ImitationTourPlan.routePath}/${MinimalTourPlan.id}`);
      tourPlanViewPO.expectVisible();
      tourPlanViewPO.expectReadonly();
    });
  });
});
