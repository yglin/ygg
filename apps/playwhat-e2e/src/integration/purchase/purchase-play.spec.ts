import {
  SiteNavigator,
  TourPlanAdminPageObjectCypress,
  TourPlanBuilderPageObjectCypress,
  TourPlanViewPageObjectCypress,
  PlayViewPageObjectCypress
} from '@ygg/playwhat/test';
import { login, theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { waitForLogin } from '@ygg/shared/user/test';
import { TheThing } from '@ygg/the-thing/core';
import {
  MyThingsDataTablePageObjectCypress,
  MyThingsPageObjectCypress
} from '@ygg/the-thing/test';
import {
  SampleAdditions,
  SamplePlays,
  PlaysWithoutAddition,
  PlaysWithAddition
} from '../play/sample-plays';
import {
  TourPlanWithPlaysAndAdditions,
  TourPlanWithPlaysNoAddition
} from '../tour-plan/sample-tour-plan';
import {
  ImageThumbnailListPageObjectCypress,
  ImageThumbnailItemPageObjectCypress
} from '@ygg/shared/ui/test';
import { HeaderPageObjectCypress } from '../../support/header.po';
import {
  Purchase,
  CellNames as ShoppingCellNames,
  RelationAddition
} from '@ygg/shopping/core';
import { ShoppingCartEditorPageObjectCypress } from '@ygg/shopping/test';
import { sum, keyBy, values, random, last, remove } from 'lodash';
import { randomBytes } from 'crypto';

describe('Tour-plan builder', () => {
  const siteNavigator = new SiteNavigator();
  const SampleThings = SamplePlays.concat(SampleAdditions);
  const imageThumbnailListPO = new ImageThumbnailListPageObjectCypress();
  const headerPO = new HeaderPageObjectCypress();

  const tourPlanViewPO = new TourPlanViewPageObjectCypress();
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
      const playViewPO = new PlayViewPageObjectCypress();
      playViewPO.expectVisible();
      playViewPO.purchase([purchases[play.id]]);
    });
    return values(purchases);
  }

  before(() => {
    login().then(user => {
      currentUser = user;
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
    // Goto my-things page and delete all test things
    // const myThingsPO = new MyThingsPageObjectCypress();
    // siteNavigator.goto(['the-things', 'my'], myThingsPO);
    // cy.wait(3000);
    // myThingsPO.deleteAll();
    theMockDatabase.clear();
  });

  it('Show plays in home page', () => {
    imageThumbnailListPO.expectItems(SamplePlays);
  });

  it('Show purchase count in badge of shopping cart button', () => {
    // Hide cart button when no purchase in cart
    headerPO.expectCartButtonHidden();
    purchasePlays([PlaysWithoutAddition[0]]);
    // Show cart button with count of purchases as badge
    headerPO.shoppingCartButtonPO.expectBadge(1);
    const cartPO = new ShoppingCartEditorPageObjectCypress();
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    //Hide badge of shopping cart button after visit shopping cart page
    headerPO.shoppingCartButtonPO.expectBadge('hide');
  });

  it('Show purchased plays in cart page', () => {
    const purchases = purchasePlays(PlaysWithoutAddition);
    const totalCharge = sum(values(purchases).map(p => p.charge));
    const cartPO = new ShoppingCartEditorPageObjectCypress();
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.expectPurchases(values(purchases));
    cartPO.expectTotalCharge(totalCharge);
  });

  it('Remove purchases in cart page', () => {
    const purchases = purchasePlays(PlaysWithoutAddition);
    const playToBeRemoved = last(PlaysWithoutAddition);
    const [purchaseToBeRemoved, ...rest] = remove(
      purchases,
      p => p.productId === playToBeRemoved.id
    );
    const totalCharge = sum(values(purchases).map(p => p.charge));
    const cartPO = new ShoppingCartEditorPageObjectCypress();
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.removePurchase(purchaseToBeRemoved);
    cartPO.expectTotalCharge(totalCharge);
  });

  it('Remove all in cart page', () => {
    const purchases = purchasePlays(PlaysWithoutAddition);
    const cartPO = new ShoppingCartEditorPageObjectCypress();
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.removeAll();
    cartPO.expectTotalCharge(0);
    // Hide cart button when no purchase in cart
    headerPO.expectCartButtonHidden();
  });

  it('Show addition purchases when play has additions', () => {
    const purchases: Purchase[] = [];
    const play = PlaysWithAddition[0];
    purchases.push(
      new Purchase({
        productId: play.id,
        price: play.getCellValue(ShoppingCellNames.price),
        quantity: random(1, 30)
      })
    );
    for (const relation of play.getRelations(RelationAddition.name)) {
      const addition: TheThing = theMockDatabase.getEntity(
        `${TheThing.collection}/${relation.objectId}`
      );
      purchases.push(
        new Purchase({
          productId: addition.id,
          price: addition.getCellValue(ShoppingCellNames.price),
          quantity: random(1, 30)
        })
      );
    }
    const totalCharge = sum(values(purchases).map(p => p.charge));

    // Start test
    siteNavigator.goto();
    const playThumbnailPO = imageThumbnailListPO.getItemPageObject(play);
    playThumbnailPO.clickLink();
    const playViewPO = new PlayViewPageObjectCypress();
    playViewPO.expectVisible();
    playViewPO.purchase(purchases);
    const cartPO = new ShoppingCartEditorPageObjectCypress();
    siteNavigator.goto(['shopping', 'cart'], cartPO);
    cartPO.expectPurchases(values(purchases));
    cartPO.expectTotalCharge(totalCharge);
  });

  // it('Change quantity of purchases in cart page', () => {});

  // it('Submit purchases to tour-plan creation page', () => {});

  // it('Import purchases in tour-plan creation page', () => {});

  // ==================== Deprecte Below ======================

  // it('Build a tour-plan, book a few plays', () => {
  //   tourPlanViewPO.setValue(TourPlanWithPlaysNoAddition, {
  //     freshNew: true
  //   });
  //   tourPlanViewPO.save(TourPlanWithPlaysNoAddition);

  //   // Expect redirect to tour-plan view page, and check selected plays
  //   tourPlanViewPO.expectShowAsPage();
  //   tourPlanViewPO.expectValue(TourPlanWithPlaysNoAddition);
  // });

  // it('Book a few plays, then fill the tour-plan', () => {});

  // it('Book a few plays with additions', () => {
  //   tourPlanBuilderPO.setValue(TourPlanWithPlaysAndAdditions);
  //   tourPlanBuilderPO.tourPlanPreviewPO.save(TourPlanWithPlaysAndAdditions);

  //   // Expect redirect to tour-plan view page, and check selected plays
  //   tourPlanViewPO.expectShowAsPage();
  //   tourPlanViewPO.expectValue(TourPlanWithPlaysAndAdditions);
  // });
});
