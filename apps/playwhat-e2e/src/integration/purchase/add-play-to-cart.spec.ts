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

describe('Purchase plays and add to cart', () => {
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

  it('Show plays in home page', () => {
    imageThumbnailListPO.expectItems(SamplePlays);
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
  });

  it('Show purchased plays in cart page', () => {
    const purchases = purchasePlays(PlaysWithoutEquipment);
    const totalCharge = sum(values(purchases).map(p => p.charge));
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.expectPurchases(values(purchases));
    cartPO.expectTotalCharge(totalCharge);
  });

  it('Remove purchases in cart page', () => {
    const purchases = purchasePlays(PlaysWithoutEquipment);
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

  it('Remove all in cart page', () => {
    const purchases = purchasePlays(PlaysWithoutEquipment);
    siteNavigator.goto(['shopping', 'cart'], cartPO);
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
        price: play.getCellValue(ShoppingCellNames.price),
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
          price: equipment.getCellValue(ShoppingCellNames.price),
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

  it('Change quantity of purchases in cart page', () => {
    const purchases = cloneDeep(purchasePlays(PlaysWithoutEquipment));
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
