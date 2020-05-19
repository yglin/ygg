import { PageObject } from '@ygg/shared/test/page-object';
import { MatBadgePageObjectCypress } from '@ygg/shared/test/cypress';
import { ShoppingCartButtonPageObjectCypress } from '@ygg/shopping/test';

export class HeaderPageObjectCypress extends PageObject {
  selectors = {
    main: '.pw-header',
    buttonShoppingCart: '.shopping-cart'
  };
  shoppingCartButtonPO: ShoppingCartButtonPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.shoppingCartButtonPO = new ShoppingCartButtonPageObjectCypress(
      this.getSelector('buttonShoppingCart')
    );
  }

  expectCartButtonHidden() {
    cy.get(this.getSelector('buttonShoppingCart')).should('not.be.visible');
  }

  // expectCartButton(
  //   options: { purchaseCount?: number; hideBadge?: boolean } = {}
  // ) {
  //   const matBadgePO = new MatBadgePageObjectCypress(
  //     this.getSelector('buttonShoppingCart')
  //   );
  //   cy.get(this.getSelector('buttonShoppingCart')).should('be.visible');
  //   if (options.purchaseCount) {
  //     matBadgePO.expectNumber(options.purchaseCount);
  //   }
  //   if (options.hideBadge) {
  //     cy.get(matBadgePO.getSelector()).should('not.be.visible');
  //   }
  // }
}
