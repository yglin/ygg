import { DateRange, DayTimeRange } from '@ygg/shared/omni-types/core';
import { TheThing, TheThingCell, TheThingFilter } from '@ygg/the-thing/core';
import { TourPlanViewPageObject } from '@ygg/playwhat/ui';
import {
  DateRangeViewPageObjectCypress,
  DayTimeRangeViewPageObjectCypress,
  ContactViewPageObjectCypress,
  OmniTypeViewControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import {
  ControlViewSwitchPageObjectCypress,
  YggDialogPageObjectCypress,
  ConfirmDialogPageObjectCypress,
  AlertDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import {
  TheThingCellViewPageObjectCypress,
  CellCreatorPageObjectCypress
} from '@ygg/the-thing/test';
import {
  PurchaseListPageObjectCypress,
  ShoppingCartEditorPageObjectCypress
} from '@ygg/shopping/test';
import {
  RelationNamePurchase,
  Purchase,
  CellNameQuantity,
  ImitationOrder,
  RelationAddition
} from '@ygg/shopping/core';
import { isEmpty, find } from 'lodash';
import { MockDatabase, theMockDatabase } from '@ygg/shared/test/cypress';
import { IPurchasePack } from '@ygg/shopping/ui';

export interface IOptionsSetValue {
  freshNew?: boolean;
  newCells?: TheThingCell[];
  newPurchases?: IPurchasePack;
}

export class TourPlanViewPageObjectCypress extends TourPlanViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.dateRangeViewPO = new DateRangeViewPageObjectCypress(
      this.getSelector('dateRange')
    );
    this.contactViewPO = new ContactViewPageObjectCypress(
      this.getSelector('contact')
    );
    this.purchaseListPO = new PurchaseListPageObjectCypress(
      this.getSelector('purchases')
    );
  }

  expectShowAsPage() {
    cy.url().should('match', /the-things\/[^\/]+\/?/);
    this.expectVisible();
  }

  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
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

  expectState(stateLabel: string): void {
    cy.get(this.getSelector('state')).should('include.text', stateLabel);
  }

  expectValue(tourPlan: TheThing) {
    this.expectName(tourPlan.name);
    const requiredCells = ImitationTourPlan.getRequiredCellNames();
    for (const requiredCell of requiredCells) {
      const cell = tourPlan.cells[requiredCell];
      this.expectCell(cell);
    }
    const optionalCells = ImitationTourPlan.getOptionalCellNames();
    for (const optionalCell of optionalCells) {
      if (tourPlan.hasCell(optionalCell)) {
        const cell = tourPlan.cells[optionalCell];
        this.expectCell(cell);
      }
    }
    if (tourPlan.hasRelation(RelationNamePurchase)) {
      // tslint:disable-next-line: no-unused-expression
      const purchases = tourPlan.getRelations(RelationNamePurchase).map(r => {
        const product: TheThing = theMockDatabase.getEntity(
          `${TheThing.collection}/${r.objectId}`
        ) as TheThing;
        return Purchase.purchase(
          tourPlan,
          product,
          r.getCellValue(CellNameQuantity)
        );
      });
      this.purchaseListPO.expectPurchases(purchases);
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

  cancelApplied() {
    cy.get(this.getSelector('buttonCancelApplied')).click();
  }

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

  save(tourPlan: TheThing): void {
    this.issueSave(tourPlan);
    this.alertSaved(tourPlan);
  }

  issueSave(tourPlan: TheThing) {
    cy.get(this.getSelector('buttonSave')).click();
    const confirmDialogPO = new ConfirmDialogPageObjectCypress();
    confirmDialogPO.expectMessage(`確定要儲存 ${tourPlan.name} ？`);
    confirmDialogPO.confirm();
  }

  alertSaved(tourPlan: TheThing) {
    const alertDialogPO = new AlertDialogPageObjectCypress();
    alertDialogPO.expectMessage(`已成功儲存 ${tourPlan.name}`);
    alertDialogPO.confirm();
  }

  setValue(tourPlan: TheThing, options: IOptionsSetValue = {}) {
    if (options.freshNew) {
      // Show required name error
      this.expectError(this.getSelector('name'), '請填入遊程名稱');
    }

    if (tourPlan.name) {
      this.setName(tourPlan.name);
    }

    const orderedRequiredCells = tourPlan.getCellsByNames(
      ImitationTourPlan.getRequiredCellNames()
    );

    if (options.freshNew) {
      // Only show first required cell, hide rest cells and other optional inputs
      for (let index = 1; index < orderedRequiredCells.length; index++) {
        const cell = orderedRequiredCells[index];
        cy.get(this.getSelectorForCell(cell.name)).should('not.be.visible');
      }
      cy.get(this.getSelector('optionals')).should('not.be.visible');
    }

    cy.wrap(orderedRequiredCells).each((cell: any, index: number) => {
      if (options.freshNew) {
        // Show required error
        this.expectError(
          this.getSelectorForCell(cell.name),
          `請填入${cell.name}`
        );
      }
      const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
        this.getSelectorForCell(cell.name)
      );
      omniTypeViewControlPO.setValue(cell.type, cell.value);

      if (options.freshNew && index + 1 < orderedRequiredCells.length) {
        // Reveal next required cell
        const nextCell = orderedRequiredCells[index + 1];
        cy.get(this.getSelectorForCell(nextCell.name)).should('be.visible');
      }
    });

    if (options.freshNew) {
      // Reveal optional inputs
      cy.get(this.getSelector('optionals')).should('be.visible');
    }

    if (!isEmpty(options.newCells)) {
      cy.wrap(options.newCells).each((cell: any) => {
        this.addOptionalCell(cell);
      });
    }

    // Edit purchases
    if (!isEmpty(options.newPurchases)) {
      this.gotoEditPurchases();
      const cartEditorPO = new ShoppingCartEditorPageObjectCypress();
      cartEditorPO.expectVisible();
      cartEditorPO.purchasePack(options.newPurchases);
      cartEditorPO.expectPurchases(options.newPurchases.finalList);
      cartEditorPO.submit();
      this.expectVisible();
    }

    this.expectValue(tourPlan);
  }

  expectError(selector: string, errorMessage: string) {
    cy.get(selector).should('include.text', errorMessage);
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
    this.expectCell(cell);
  }

  expectReadonly() {
    cy.get(this.getSelector('editButtons')).should('not.be.visible');
  }

  deleteCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.name)} button.delete`).click();
    this.expectNoCell(cell);
  }

  expectNoCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCell(cell.name)).should('not.exist');
  }
}
