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
  YggDialogPageObjectCypress
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
    const cellViewPagePO = new TheThingCellViewPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    cellViewPagePO.expectValue(cell);
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
    const controlViewSwitchPO = new ControlViewSwitchPageObjectCypress(
      this.getSelector('name')
    );
    controlViewSwitchPO.openControl();
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(name);
    controlViewSwitchPO.closeControl();
  }

  setCellValue(cell: TheThingCell): void {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    omniTypeViewControlPO.setValue(cell.type, cell.value);
  }

  save(): void {
    cy.get(this.getSelector('buttonSave')).click();
  }

  setValue(tourPlan: TheThing, options: IOptionsSetValue = {}) {
    // const purchasePlays: TheThing[] = [];
    // const purchaseAdditions: TheThing[] = [];
    // const finalPurchases: Purchase[] = [];
    // if (tourPlan.hasRelation(RelationNamePurchase)) {
    //   const relations = tourPlan.getRelations(RelationNamePurchase);
    //   purchasePlays.push.apply(
    //     purchasePlays,
    //     relations
    //       .map(
    //         r =>
    //           theMockDatabase.getEntity(
    //             `${TheThing.collection}/${r.objectId}`
    //           ) as TheThing
    //       )
    //       .filter(pl => !!pl && ImitationPlay.filter.test(pl))
    //   );

    //   for (const play of purchasePlays) {
    //     if (play.hasRelation(RelationAddition.name)) {
    //       purchaseAdditions.push.apply(
    //         purchaseAdditions,
    //         play
    //           .getRelationObjectIds(RelationAddition.name)
    //           .map(objId =>
    //             theMockDatabase.getEntity(`${TheThing.collection}/${objId}`)
    //           )
    //           .filter(ad => !!ad)
    //       );
    //     }
    //   }

    //   finalPurchases.push.apply(
    //     finalPurchases,
    //     this.fromRelations(tourPlan.getRelations(RelationNamePurchase))
    //   );
    // }

    if (tourPlan.name) {
      this.setName(tourPlan.name);
    }

    cy.wrap(
      tourPlan.getCellsByNames(ImitationTourPlan.getRequiredCellNames())
    ).each((cell: any) => {
      this.setCellValue(cell);
    });

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
}
