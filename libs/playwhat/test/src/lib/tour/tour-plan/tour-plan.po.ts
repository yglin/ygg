import { ImitationTourPlan, ImitationEvent } from '@ygg/playwhat/core';
import { TourPlanPageObject } from '@ygg/playwhat/ui';
import {
  ContactViewPageObjectCypress,
  DateRangeViewPageObjectCypress,
  OmniTypeViewControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  ImageThumbnailItemPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { Purchase } from '@ygg/shopping/core';
import { PurchaseListPageObjectCypress } from '@ygg/shopping/test';
import { IPurchasePack } from '@ygg/shopping/ui';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import {
  CellCreatorPageObjectCypress,
  TheThingStatePageObjectCypress,
  TheThingPageObjectCypress,
  TheThingThumbnailPageObjectCypress
} from '@ygg/the-thing/test';

export class TourPlanPageObjectCypress extends TourPlanPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingPO = new TheThingPageObjectCypress(
      this.getSelector('theThing'),
      ImitationTourPlan
    );
    this.statePO = new TheThingStatePageObjectCypress(
      this.getSelector('state')
    );
    // this.dateRangeViewPO = new DateRangeViewPageObjectCypress(
    //   this.getSelector('dateRange')
    // );
    // this.contactViewPO = new ContactViewPageObjectCypress(
    //   this.getSelector('contact')
    // );
    // this.purchaseListPO = new PurchaseListPageObjectCypress(
    //   this.getSelector('purchases')
    // );
  }

  expectShowAsPage() {
    const regex = new RegExp(`${ImitationTourPlan.routePath}\/[^\/]+\/?`, 'g');
    cy.url().should('match', regex);
    this.expectVisible();
  }

  expectFreshNew() {
    this.expectError(this.getSelector('name'), '請填入遊程名稱');
    const orderedRequiredCells = ImitationTourPlan.getRequiredCellDefs().map(
      cellDef => cellDef.createCell()
    );
    // Only show first required cell, hide rest cells and other optional inputs
    for (let index = 1; index < orderedRequiredCells.length; index++) {
      const cell = orderedRequiredCells[index];
      cy.get(this.getSelectorForCell(cell.name)).should('not.be.visible');
    }
    cy.get(this.getSelector('optionals')).should('not.be.visible');
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectName(name: string) {
    cy.get(this.getSelector('name')).should('include.text', name);
  }

  expectCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.name)} h4`).contains(cell.name);
    // const cellViewPagePO = new TheThingCellViewPageObjectCypress(
    //   this.getSelectorForCell(cell.name)
    // );
    const cellViewPagePO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    cellViewPagePO.expectValue(cell.type, cell.value);
  }

  // expectState(state: TheThingState): void {
  //   this.statePO.expectState(state);
  //   // cy.get(this.getSelector('state')).should('include.text', stateLabel);
  // }

  expectValue(tourPlan: TheThing) {
    this.theThingPO.expectValue(tourPlan);
    // this.expectName(tourPlan.name);
    // const requiredCells = ImitationTourPlan.getRequiredCellNames();
    // for (const requiredCell of requiredCells) {
    //   const cell = tourPlan.cells[requiredCell];
    //   this.expectCell(cell);
    // }
    // const optionalCells = ImitationTourPlan.getOptionalCellNames();
    // for (const optionalCell of optionalCells) {
    //   if (tourPlan.hasCell(optionalCell)) {
    //     const cell = tourPlan.cells[optionalCell];
    //     this.expectCell(cell);
    //   }
    // }
    // if (tourPlan.hasRelation(RelationPurchase.name)) {
    //   // tslint:disable-next-line: no-unused-expression
    //   const purchases = tourPlan.getRelations(RelationPurchase.name).map(r => {
    //     const product: TheThing = theMockDatabase.getEntity(
    //       `${TheThing.collection}/${r.objectId}`
    //     ) as TheThing;
    //     return Purchase.purchase(
    //       tourPlan,
    //       product,
    //       r.getCellValue(CellNames.quantity)
    //     );
    //   });
    //   this.purchaseListPO.expectPurchases(purchases);
    // }
  }

  expectPurchases(purchases: Purchase[]) {
    for (const purchase of purchases) {
      const product: TheThing = theMockDatabase.getEntity(
        `${TheThing.collection}/${purchase.productId}`
      );
      const itemPO = new ImageThumbnailItemPageObjectCypress(
        `${this.getSelector()} .purchases [object-id="${purchase.productId}"]`
      );
      itemPO.expectValue(product);
    }
  }

  submitApplication(): void {
    cy.get(this.getSelector('buttonSubmitApplication')).click();
  }

  adminComplete() {
    cy.get(this.getSelector('buttonAdminComplete')).click();
  }

  adminPaid() {
    cy.get(this.getSelector('buttonAdminPaid')).click();
  }

  // setState(tourPlan: TheThing, state: TheThingState) {
  //   this.statePO.setState(tourPlan, state);
  //   // cy.get(this.getSelectorForButtonState(state)).click();
  //   // const confirmDialogPO = new ConfirmDialogPageObjectCypress();
  //   // let confirmMessage = `要將 ${tourPlan.name} 的狀態設為 ${state.label}？`;
  //   // if (typeof state.confirmMessage === 'string') {
  //   //   confirmMessage = state.confirmMessage;
  //   // } else if (typeof state.confirmMessage === 'function') {
  //   //   confirmMessage = state.confirmMessage(tourPlan);
  //   // }
  //   // confirmDialogPO.expectMessage(confirmMessage);
  //   // confirmDialogPO.confirm();
  // }

  gotoEditOptionalCells(): void {
    cy.get(this.getSelector('buttonGotoEditOptionalCells')).click();
  }

  gotoEditPurchases(): void {
    cy.get(this.getSelector('buttonGotoEditPurchases')).click();
  }

  setName(name: string) {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelector('name')
    );
    omniTypeViewControlPO.setValue('text', name);
    // const controlViewSwitchPO = new ControlViewSwitchPageObjectCypress(
    //   this.getSelector('name')
    // );
    // controlViewSwitchPO.openControl();
    // cy.get(this.getSelector('inputName'))
    //   .clear()
    //   .type(name);
    // controlViewSwitchPO.closeControl();
  }

  setCell(cell: TheThingCell): void {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    omniTypeViewControlPO.setValue(cell.type, cell.value);
  }

  // save(
  //   tourPlan: TheThing,
  //   options: {
  //     freshNew?: boolean;
  //     sendApplication?: boolean;
  //   } = { freshNew: true }
  // ): void {
  //   this.issueSave(tourPlan);
  //   if (options.freshNew) {
  //     this.sendApplication(options.sendApplication);
  //   }
  //   this.alertSaved(tourPlan);
  // }

  // issueSave(tourPlan: TheThing) {
  //   cy.get(this.getSelector('buttonSave')).click();
  //   const emceePO = new EmceePageObjectCypress();
  //   emceePO.confirm(`確定要儲存 ${tourPlan.name} ？`);
  // }

  // alertSaved(tourPlan: TheThing) {
  //   const emceePO = new EmceePageObjectCypress();
  //   emceePO.alert(`已成功儲存 ${tourPlan.name}`);
  // }

  sendApplication(tourPlan: TheThing) {
    this.theThingPO.runAction(ImitationTourPlan.actions['send-application']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`將此遊程 ${tourPlan.name} 送出申請？`);
    emceePO.alert(`遊程 ${tourPlan.name} 已送出申請，等待管理者審核。`);
  }

  cancelApplication(tourPlan: TheThing) {
    this.theThingPO.runAction(ImitationTourPlan.actions['cancel-application']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`取消此遊程 ${tourPlan.name} 的申請？`);
    emceePO.alert(`遊程 ${tourPlan.name} 已取消申請。`);
  }

  confirmPaid(tourPlan: TheThing) {
    this.theThingPO.runAction(ImitationTourPlan.actions['confirm-paid']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `確定此遊程 ${tourPlan.name} 的所有款項已付清，標記為已付款？`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 標記為已付款。`);
  }

  confirmCompleted(tourPlan: TheThing) {
    this.theThingPO.runAction(ImitationTourPlan.actions['confirm-completed']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(
      `確定此遊程 ${tourPlan.name} 的所有活動流程已結束，標記為已完成？`
    );
    emceePO.alert(`遊程 ${tourPlan.name} 標記為已完成。`);
  }

  setValue(
    tourPlan: TheThing,
    options: {
      freshNew?: boolean;
      newCells?: TheThingCell[];
      newPurchases?: IPurchasePack;
    } = {}
  ) {
    // if (options.freshNew) {
    //   this.expectFreshNew();
    // }

    this.theThingPO.setValue(tourPlan);

    // if (tourPlan.name) {
    //   this.setName(tourPlan.name);
    // }

    // const orderedRequiredCells = tourPlan.getCellsByNames(
    //   ImitationTourPlan.getRequiredCellNames()
    // );

    // cy.wrap(orderedRequiredCells).each((cell: any, index: number) => {
    //   if (options.freshNew) {
    //     // Show required error
    //     this.expectError(
    //       this.getSelectorForCell(cell.name),
    //       `請填入${cell.name}`
    //     );
    //   }
    //   const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
    //     this.getSelectorForCell(cell.name)
    //   );
    //   omniTypeViewControlPO.setValue(cell.type, cell.value);

    //   if (options.freshNew && index + 1 < orderedRequiredCells.length) {
    //     // Reveal next required cell
    //     const nextCell = orderedRequiredCells[index + 1];
    //     cy.get(this.getSelectorForCell(nextCell.name)).should('be.visible');
    //   }
    // });

    // if (options.freshNew) {
    //   // Reveal optional inputs
    //   cy.get(this.getSelector('optionals'), { timeout: 10000 })
    //     .scrollIntoView()
    //     .should('be.visible');
    // }

    // const additionalCells = ImitationTourPlan.pickNonRequiredCells(
    //   values(tourPlan.cells)
    // );
    // if (options.freshNew) {
    //   cy.wrap(additionalCells).each((cell: any) => {
    //     this.addOptionalCell(cell);
    //     this.expectCell(cell);
    //   });
    // } else if (options.newCells) {
    //   cy.wrap(options.newCells).each((cell: any) => {
    //     this.addOptionalCell(cell);
    //     this.expectCell(cell);
    //   });
    // }

    // // Edit purchases
    // const purchaseRelations = tourPlan.getRelations(RelationPurchase.name);
    // const purchases: Purchase[] = purchaseRelations.map(pr =>
    //   Purchase.fromRelation(pr)
    // );
    // if (options.freshNew && !isEmpty(purchases)) {
    //   this.gotoEditPurchases();
    //   const cartEditorPO = new ShoppingCartEditorPageObjectCypress();
    //   cartEditorPO.expectVisible();
    //   cartEditorPO.purchasePack({
    //     filter: ImitationPlay.filter,
    //     purchases
    //   });
    //   cartEditorPO.expectPurchases(purchases);
    //   cartEditorPO.submit();
    //   this.expectVisible();
    // }

    // this.expectValue(tourPlan);
  }

  expectError(selector: string, errorMessage: string) {
    cy.get(selector).should('include.text', errorMessage);
  }

  addCell(cell: TheThingCell) {
    cy.get(this.getSelector('buttonAddCell')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    dialogPO.expectVisible();
    const cellCreatorPO = new CellCreatorPageObjectCypress(
      dialogPO.getSelector()
    );
    cellCreatorPO.setCell(cell);
    cellCreatorPO.setCellValue(cell);
    dialogPO.confirm();
    dialogPO.expectClosed();
  }

  addOptionalCell(cell: TheThingCell): void {
    cy.get(this.getSelector('buttonAddCell')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    dialogPO.expectVisible();
    const cellCreatorPO = new CellCreatorPageObjectCypress(
      dialogPO.getSelector()
    );
    cellCreatorPO.selectPreset(cell.name);
    cellCreatorPO.setCellValue(cell);
    dialogPO.confirm();
    dialogPO.expectClosed();
  }

  expectModifiable() {
    cy.get(this.getSelector('editButtons')).should('be.visible');
  }

  expectReadonly() {
    cy.get(this.getSelector('editButtons')).should('not.be.visible');
  }

  deleteCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.name)} button.delete`).click();
  }

  expectNoCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCell(cell.name)).should('not.exist');
  }

  expectNoCells(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: TheThingCell) => this.expectNoCell(cell));
  }

  importToCart() {
    cy.get(this.getSelector('buttonImportToCart')).click();
  }

  expectTotalCharge(totalCharge: number) {
    cy.get(this.getSelector('totalCharge')).should(
      'include.text',
      `總價：NTD ${totalCharge}`
    );
  }

  expectEvents(events: TheThing[]) {
    for (const event of events) {
      const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
        this.getSelectorForEvent(event),
        ImitationEvent
      );
      theThingThumbnailPO.expectValue(event);
    }
  }
}
