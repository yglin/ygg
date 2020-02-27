import { ShoppingCartEditorPageObject } from '@ygg/shopping/ui';
import { ImageThumbnailItemPageObjectCypress } from '@ygg/shared/ui/test';
import { TheThing } from '@ygg/the-thing/core';

export class ShoppingCartEditorPageObjectCypress extends ShoppingCartEditorPageObject {
  expectTotalCharge(totalCharge: number): void {
    cy.get(this.getSelector('totalCharge')).should(
      'include.text',
      `NTD ${totalCharge}`
    );
  }

  expectProducts(products: TheThing[]) {
    cy.wrap(products).each((item: any) => {
      const product: TheThing = item;
      cy.get(this.getSelectorForProduct(product.id)).should('be.exist');
    });
  }

  setQuantity(productId: string, quantity: number) {
    cy.get(this.getSelectorForProductQuantityInput(productId))
      .clear()
      .type(quantity.toString());
  }
}
