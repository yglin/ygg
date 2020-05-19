import {
  ShoppingCartEditorPageObject,
  PurchaseRowPageObject,
  IPurchasePack
} from '@ygg/shopping/ui';
import {
  ImageThumbnailItemPageObjectCypress,
  YggDialogPageObjectCypress,
  ConfirmDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { Purchase } from '@ygg/shopping/core';
import { sum } from 'lodash';
import { IDataAccessor } from '@ygg/shared/infra/core';
import { TheThingFinderPageObjectCypress } from '@ygg/the-thing/test';
import { theMockDatabase } from '@ygg/shared/test/cypress';

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

  clickDelete() {
    cy.get(this.getSelector('buttonDelete')).click();
  }
}

export class ShoppingCartEditorPageObjectCypress extends ShoppingCartEditorPageObject {
  submit(): void {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
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

  purchasePack(pack: IPurchasePack): void {
    cy.get(this.getSelector('buttonAddPurchase')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    const theThingFinderPO = new TheThingFinderPageObjectCypress(
      dialogPO.getSelector()
    );
    dialogPO.expectVisible();
    theThingFinderPO.expectVisible();
    theThingFinderPO.theThingFilterPO.expectFilter(pack.filter);
    const products: TheThing[] = pack.purchases.map(p =>
      theMockDatabase.getEntity(p.productId)
    );
    theThingFinderPO.selectItems(products);
    dialogPO.confirm();
    dialogPO.expectClosed();
    this.updatePurchases(pack.purchases);
  }

  updatePurchases(purchases: Purchase[]): void {
    cy.wrap(purchases).each((purchase: any) => {
      const purchaseRowPO = new PurchaseRowPageObjectCypress(
        this.getSelectorForPurchase(purchase)
      );
      purchaseRowPO.setValue(purchase);
    });
  }

  clearPurchases() {
    cy.get(this.getSelector('buttonClear')).click();
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

  removePurchase(purchase: Purchase) {
    const purchaseRowPO = new PurchaseRowPageObjectCypress(
      this.getSelectorForPurchase(purchase)
    );
    purchaseRowPO.clickDelete();
    const confirmDialogPO = new ConfirmDialogPageObjectCypress();
    const product = theMockDatabase.getEntity(
      `${TheThing.collection}/${purchase.productId}`
    );
    confirmDialogPO.expectMessage(`確定要移除購買項目：${product.name}？`);
    confirmDialogPO.confirm();
    cy.get(this.getSelectorForPurchase(purchase)).should('not.be.visible');
  }

  removeAll() {
    cy.get(this.getSelector('buttonClear')).click();
    const confirmDialogPO = new ConfirmDialogPageObjectCypress();
    confirmDialogPO.expectMessage(`確定要移除所有購買項目？`);
    confirmDialogPO.confirm();
    cy.get(this.getSelectorForPurchase()).should('not.be.visible');
  }
}
