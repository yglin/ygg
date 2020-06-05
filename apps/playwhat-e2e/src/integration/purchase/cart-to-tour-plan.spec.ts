import {
  SiteNavigator,
  TourPlanViewPageObjectCypress
} from '@ygg/playwhat/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  ImageThumbnailListPageObjectCypress,
  ConfirmDialogPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { waitForLogin } from '@ygg/shared/user/test';
import {
  CellNames as ShoppingCellNames,
  Purchase,
  PurchaseAction
} from '@ygg/shopping/core';
import {
  ShoppingCartEditorPageObjectCypress,
  PurchaseProductPageObjectCypress
} from '@ygg/shopping/test';
import { TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import {
  keyBy,
  sum,
  values,
  sample,
  sampleSize,
  last,
  remove,
  random,
  cloneDeep
} from 'lodash';
import { HeaderPageObjectCypress } from '../../support/header.po';
import {
  SampleEquipments,
  SamplePlays,
  PlaysWithoutEquipment,
  PlaysWithEquipment
} from '../play/sample-plays';
import {
  // TourPlanWithPlaysNoEquipment,
  // TourPlanWithPlaysAndEquipments,
  TourPlanFull
} from '../tour-plan/sample-tour-plan';
import { ImitationPlay, RelationshipEquipment } from '@ygg/playwhat/core';

describe('Import/export purchases between cart and tour-plan', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleEquipments);
  // .concat([
  //   TourPlanWithPlaysNoEquipment
  // ]);
  const imageThumbnailListPO = new ImageThumbnailListPageObjectCypress();
  const cartPO = new ShoppingCartEditorPageObjectCypress();
  const headerPO = new HeaderPageObjectCypress();
  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const playPO = new TheThingPageObjectCypress('', ImitationPlay);
  let currentUser: User;

  function purchasePlays(plays: TheThing[]): Purchase[] {
    const purchases: { [playId: string]: Purchase } = keyBy(
      plays.map(play => {
        const purchase = new Purchase({
          productId: play.id,
          price: play.getCellValue(ShoppingCellNames.price),
          quantity: 10
        });
        return purchase;
      }),
      'productId'
    );
    cy.wrap(plays).each((play: any) => {
      siteNavigator.goto();
      const playThumbnailPO = imageThumbnailListPO.getItemPageObject(play);
      playThumbnailPO.clickLink();
      playPO.expectVisible();
      playPO.runAction(PurchaseAction);
      const dialogPO = new YggDialogPageObjectCypress();
      const purchasePO = new PurchaseProductPageObjectCypress(
        dialogPO.getSelector()
      );
      purchasePO.setValue([purchases[play.id]]);
      dialogPO.confirm();
    });
    return values(purchases);
  }

  before(() => {
    login().then(user => {
      currentUser = user;
      theMockDatabase.setAdmins([user.id]);
      cy.wrap(SampleThings).each((thing: any) => {
        thing.ownerId = user.id;
        theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
      });
      cy.visit('/');
    });
  });

  beforeEach(() => {
    cy.visit('/');
    waitForLogin();
    // tourPlanBuilderPO.reset();
    // siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
  });

  // it('Submit purchases to tour-plan creation page', () => {
  //   const purchases = purchasePlays(PlaysWithoutEquipment);
  //   const totalCharge = sum(purchases.map(p => p.charge));
  //   siteNavigator.goto(['shopping', 'cart'], cartPO);
  //   cartPO.submit();
  //   tourPlanViewPO.expectVisible();
  //   tourPlanViewPO.expectPurchases(purchases);
  //   tourPlanViewPO.expectTotalCharge(totalCharge);
  // });

  // it('Import purchases from tour-plan to cart page', () => {
  //   const purchases: Purchase[] = TourPlanWithPlaysNoEquipment.getRelations(
  //     RelationPurchase.name
  //   ).map(r => Purchase.fromRelation(r));
  //   const totalCharge = sum(purchases.map(p => p.charge));
  //   const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
  //   siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
  //   myTourPlansPO.theThingDataTablePO.gotoTheThingView(
  //     TourPlanWithPlaysNoEquipment
  //   );
  //   tourPlanViewPO.expectVisible();
  //   tourPlanViewPO.expectPurchases(purchases);
  //   tourPlanViewPO.importToCart();
  //   cartPO.expectVisible();
  //   cartPO.expectPurchases(purchases);
  //   cartPO.expectTotalCharge(totalCharge);
  // });

  // it('On import, confirm clear purchases already in cart', () => {
  //   const samplePlays = sampleSize(PlaysWithoutEquipment, 2);
  //   // Purchase some plays in advance, make cart not empty
  //   purchasePlays(samplePlays);

  //   const purchases: Purchase[] = TourPlanWithPlaysNoEquipment.getRelations(
  //     RelationPurchase.name
  //   ).map(r => Purchase.fromRelation(r));
  //   const totalCharge = sum(purchases.map(p => p.charge));
  //   const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
  //   siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
  //   myTourPlansPO.theThingDataTablePO.gotoTheThingView(
  //     TourPlanWithPlaysNoEquipment
  //   );
  //   tourPlanViewPO.expectVisible();
  //   tourPlanViewPO.importToCart();
  //   const confirmPO = new ConfirmDialogPageObjectCypress();
  //   confirmPO.expectMessage('原本在購物車中的購買項目將會被清除，是否繼續？');
  //   confirmPO.confirm();
  //   cartPO.expectVisible();
  //   cartPO.expectPurchases(purchases);
  //   cartPO.expectTotalCharge(totalCharge);
  // });

  // it('Save tour plan with purchased plays', () => {
  //   const resultTourPlan = TourPlanFull.clone();
  //   resultTourPlan.name = '測試遊程(預定體驗)';
  //   const plays = PlaysWithoutEquipment;
  //   const purchases = purchasePlays(plays);
  //   resultTourPlan.setRelation(
  //     RelationPurchase.name,
  //     purchases.map(p => p.toRelation())
  //   );
  //   const totalCharge = sum(purchases.map(p => p.charge));
  //   siteNavigator.goto(['shopping', 'cart'], cartPO);
  //   cartPO.submit();
  //   tourPlanViewPO.expectVisible();
  //   tourPlanViewPO.setValue(resultTourPlan, {
  //     freshNew: true
  //   });
  //   tourPlanViewPO.save(resultTourPlan);
  //   const myTourPlansPO = new MyThingsDataTablePageObjectCypress();
  //   siteNavigator.goto(['tour-plans', 'my'], myTourPlansPO);
  //   myTourPlansPO.theThingDataTablePO.gotoTheThingView(resultTourPlan);
  //   tourPlanViewPO.expectVisible();
  //   tourPlanViewPO.expectValue(resultTourPlan);
  //   tourPlanViewPO.expectPurchases(purchases);
  //   tourPlanViewPO.expectTotalCharge(totalCharge);
  //   // Goto my-things page and delete all test things
  //   const myThingsPO = new MyThingsPageObjectCypress();
  //   siteNavigator.goto(['the-things', 'my'], myThingsPO);
  //   cy.wait(3000);
  //   myThingsPO.deleteAll();
  // });
});
