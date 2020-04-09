import {
  ShoppingCartEditorPageObject,
  PurchaseRowPageObject
} from '@ygg/shopping/ui';
import { ImageThumbnailItemPageObjectCypress } from '@ygg/shared/ui/test';
import { TheThing } from '@ygg/the-thing/core';
import { Purchase } from '@ygg/shopping/core';
import { sum } from 'lodash';

export class PurchaseRowPageObjectCypress extends PurchaseRowPageObject {
  expectValue(purchase: Purchase): void {
    cy.get(this.getSelector('inputQuantity'))
      .invoke('val')
      .should('equal', purchase.quantity.toString());
    cy.get(this.getSelector('charge')).should(
      'include.text',
      purchase.charge.toString()
    );
  }

  setValue(purchase: Purchase): void {
    this.setQuantity(purchase.quantity);
    cy.get(this.getSelector('charge')).should(
      'include.text',
      purchase.charge.toString()
    );
  }

  setQuantity(quantity: number): void {
    cy.get(this.getSelector('inputQuantity'))
      .clear()
      .type(quantity.toString());
  }
}

export class ShoppingCartEditorPageObjectCypress extends ShoppingCartEditorPageObject {
  submit(): void {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

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
    const purchaseRowPO = new PurchaseRowPageObjectCypress(
      this.getSelectorForProduct(productId)
    );
    purchaseRowPO.setQuantity(quantity);
  }

  setPurchases(purchases: Purchase[]): void {
    cy.wrap(purchases).each((purchase: any) => {
      const purchaseRowPO = new PurchaseRowPageObjectCypress(
        this.getSelectorForPurchase(purchase)
      );
      purchaseRowPO.setValue(purchase);
    });
  }

  expectPurchases(purchases: Purchase[]): void {
    cy.wrap(purchases).each((purchase: any) => {
      const purchaseRowPO = new PurchaseRowPageObjectCypress(
        this.getSelectorForPurchase(purchase)
      );
      purchaseRowPO.expectValue(purchase);
    });
    const totalCharge = sum(purchases.map(p => p.charge));
    this.expectTotalCharge(totalCharge);
  }
}
