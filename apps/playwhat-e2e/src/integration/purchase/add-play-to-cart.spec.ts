import {
  ImitationPlay,
  RelationshipEquipment,
  ImitationPlayCellDefines
} from '@ygg/playwhat/core';
import { SiteNavigator } from '@ygg/playwhat/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import {
  ImageThumbnailListPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { loginTestUser, testUsers, waitForLogin } from '@ygg/shared/user/test';
import {
  Purchase,
  PurchaseAction,
  ShoppingCellDefines
} from '@ygg/shopping/core';
import {
  PurchaseProductPageObjectCypress,
  ShoppingCartEditorPageObjectCypress
} from '@ygg/shopping/test';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingPageObjectCypress } from '@ygg/the-thing/test';
import {
  cloneDeep,
  keyBy,
  last,
  random,
  remove,
  sum,
  values,
  find
} from 'lodash';
import { beforeAll } from '../../support/before-all';
import { HeaderPageObjectCypress } from '../../support/header.po';
import {
  PlaysWithEquipment,
  PlaysWithoutEquipment,
  SampleEquipments,
  SamplePlays
} from '../play/sample-plays';

describe('Purchase plays and add to cart', () => {
  const siteNavigator = new SiteNavigator();
  for (const play of SamplePlays) {
    ImitationPlay.setState(play, ImitationPlay.states.forSale);
  }
  const SampleThings = SamplePlays.concat(SampleEquipments);
  // .concat([
  //   TourPlanWithPlaysNoEquipment
  // ]);
  const imageThumbnailListPO = new ImageThumbnailListPageObjectCypress();
  const cartPO = new ShoppingCartEditorPageObjectCypress();
  const headerPO = new HeaderPageObjectCypress();
  // const tourPlanViewPO = new TourPlanViewPageObjectCypress();
  const playPO = new TheThingPageObjectCypress('', ImitationPlay);
  const me: User = testUsers[0];
  let purchasesGlobal: Purchase[];

  function purchasePlays(plays: TheThing[]): Purchase[] {
    const purchases: { [playId: string]: Purchase } = keyBy(
      plays.map(play => {
        const purchase = new Purchase({
          productId: play.id,
          price: play.getCellValue(ShoppingCellDefines.price.id),
          quantity: 10
        });
        return purchase;
      }),
      'productId'
    );
    cy.wrap(plays).each((play: any) => {
      siteNavigator.goto();
      const playThumbnailPO = imageThumbnailListPO.getItemPageObject(play);
      playThumbnailPO.expectVisible();
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
    beforeAll();
    theMockDatabase.setAdmins([me.id]);
    cy.wrap(SampleThings).each((thing: any) => {
      thing.ownerId = me.id;
      theMockDatabase.insert(`${TheThing.collection}/${thing.id}`, thing);
    });
    cy.visit('/');
    loginTestUser(me);
  });

  beforeEach(() => {
    // cy.visit('/');
    // waitForLogin();
    // tourPlanBuilderPO.reset();
    // siteNavigator.goto(['tour-plans', 'builder'], tourPlanBuilderPO);
  });

  after(() => {
    theMockDatabase.clear();
    theMockDatabase.restoreRTDB();
  });

  it('Show plays in home page', () => {
    imageThumbnailListPO.expectItems(SamplePlays, { exact: false });
  });

  it('Show purchase count in badge of shopping cart button', () => {
    // Hide cart button when no purchase in cart
    headerPO.expectCartButtonHidden();
    purchasePlays([PlaysWithoutEquipment[0]]);
    // Show cart button with count of purchases as badge
    headerPO.shoppingCartButtonPO.expectBadge(1);
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    //Hide badge of shopping cart button after visit shopping cart page
    headerPO.shoppingCartButtonPO.expectBadge('hide');
    cartPO.removeAll();
  });

  it('Show purchased plays in cart page', () => {
    purchasesGlobal = purchasePlays(PlaysWithoutEquipment);
    const totalCharge = sum(values(purchasesGlobal).map(p => p.charge));
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.expectPurchases(values(purchasesGlobal));
    cartPO.expectTotalCharge(totalCharge);
  });

  it('Change quantity of purchases in cart page', () => {
    cy.wrap(purchasesGlobal).then((purchases: any) => {
      // Change quantity;
      for (const purchase of purchases) {
        purchase.quantity = random(20, 50);
      }
      const totalCharge = sum(values(purchases).map(p => p.charge));
      siteNavigator.goto(['shopping', 'cart'], cartPO);
      cy.wrap(purchases).each((p: any) => {
        cartPO.setQuantity(p.productId, p.quantity);
      });
      cartPO.expectPurchases(values(purchases));
      cartPO.expectTotalCharge(totalCharge);
    });
  });

  it('Show over-maximum error when quantity exceeds maximum', () => {
    cy.wrap(purchasesGlobal).then((purchases: any) => {
      const play = PlaysWithoutEquipment[0];
      const purchase: Purchase = find(
        purchases as Purchase[],
        pc => pc.productId === play.id
      );
      const oldQuantity = purchase.quantity;
      const maximum: number = play.getCellValue(
        ImitationPlayCellDefines.maximum.id
      );
      const newQuantity = maximum + 1;
      cartPO.setQuantity(play.id, newQuantity);
      cartPO.expectOverMaximumError(play.id, newQuantity, maximum);
      cartPO.setQuantity(play.id, oldQuantity);
    });
  });

  it('Show under-minimum error when quantity less than minimum', () => {
    cy.wrap(purchasesGlobal).then((purchases: any) => {
      const play = PlaysWithoutEquipment[0];
      const purchase: Purchase = find(
        purchases as Purchase[],
        pc => pc.productId === play.id
      );
      const oldQuantity = purchase.quantity;
      const minimum: number = play.getCellValue(
        ImitationPlayCellDefines.minimum.id
      );
      const newQuantity = minimum - 1;
      cartPO.setQuantity(play.id, newQuantity);
      cartPO.expectUnderMinimumError(play.id, newQuantity, minimum);
      cartPO.setQuantity(play.id, oldQuantity);
    });
  });

  it('Remove purchases in cart page', () => {
    cy.wrap(purchasesGlobal).then((purchases: any) => {
      const playToBeRemoved = last(PlaysWithoutEquipment);
      const [purchaseToBeRemoved, ...rest] = remove(
        purchases,
        p => p.productId === playToBeRemoved.id
      );
      const totalCharge = sum(values(purchases).map(p => p.charge));
      siteNavigator.goto(['shopping', 'cart'], cartPO);
      cartPO.removePurchase(purchaseToBeRemoved);
      cartPO.expectTotalCharge(totalCharge);
    });
  });

  it('Remove all in cart page', () => {
    // const purchases = purchasePlays(PlaysWithoutEquipment);
    // siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.removeAll();
    cartPO.expectTotalCharge(0);
    // Hide cart button when no purchase in cart
    headerPO.expectCartButtonHidden();
  });

  it('Show equipment purchases when play has equipments', () => {
    const purchases: Purchase[] = [];
    const play = PlaysWithEquipment[0];
    purchases.push(
      new Purchase({
        productId: play.id,
        price: play.getCellValue(ShoppingCellDefines.price.id),
        quantity: random(1, 30)
      })
    );
    for (const relation of play.getRelations(RelationshipEquipment.name)) {
      const equipment: TheThing = theMockDatabase.getEntity(
        `${TheThing.collection}/${relation.objectId}`
      );
      purchases.push(
        new Purchase({
          productId: equipment.id,
          price: equipment.getCellValue(ShoppingCellDefines.price.id),
          quantity: random(1, 30)
        })
      );
    }
    const totalCharge = sum(values(purchases).map(p => p.charge));

    // Start test
    siteNavigator.goto();
    const playThumbnailPO = imageThumbnailListPO.getItemPageObject(play);
    playThumbnailPO.clickLink();
    playPO.expectVisible();
    playPO.runAction(PurchaseAction);
    const dialogPO = new YggDialogPageObjectCypress();
    const purchasePO = new PurchaseProductPageObjectCypress(
      dialogPO.getSelector()
    );
    purchasePO.setValue(purchases);
    dialogPO.confirm();
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.expectPurchases(values(purchases));
    cartPO.expectTotalCharge(totalCharge);
  });
});
