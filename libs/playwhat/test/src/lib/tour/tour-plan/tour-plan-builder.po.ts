import { TourPlanBuilderPageObject } from '@ygg/playwhat/ui';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { DateRange } from '@ygg/shared/omni-types/core';
import {
  DateRangeControlPageObjectCypress,
  NumberControlPageObjectCypress,
  ContactControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { ShoppingCartEditorPageObjectCypress } from '@ygg/shopping/test';
import { PageObjectCypress, theMockDatabase } from '@ygg/shared/test/cypress';
import { TheThingCellsEditorPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import { TourPlanViewPageObjectCypress } from './tour-plan-view.po';
import {
  Purchase,
  RelationAddition,
  CellNameStock,
  RelationNamePurchase,
  CellNameQuantity
} from '@ygg/shopping/core';
import { isEmpty, find, values } from 'lodash';

export interface IOptionsTourPlanBuilderSetValue {
  stopAtStep?: number;
  stopAfterStep?: number;
  hasOptionalFields?: boolean;
}

export class TourPlanBuilderPageObjectCypress extends TourPlanBuilderPageObject
  implements PageObjectCypress {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.playListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('playList')
    );
    this.dateRangeControl = new DateRangeControlPageObjectCypress(
      this.getSelector('dateRangeControl')
    );
    this.numParticipantsControl = new NumberControlPageObjectCypress(
      this.getSelector('numParticipantsControl')
    );
    this.contactControlPO = new ContactControlPageObjectCypress(
      this.getSelector('contactControl')
    );
    // this.theThingCellsEditorPO = new TheThingCellsEditorPageObjectCypress(
    //   this.getSelector('optionalCellsEditor')
    // );
    // this.cartEditorPO = new ShoppingCartEditorPageObjectCypress(
    //   this.getSelector('shoppingCart')
    // );
    this.tourPlanPreviewPO = new TourPlanViewPageObjectCypress(
      this.getSelector('preview')
    );
  }

  // gotoFirstStep() {
  //   this.prev();
  //   this.prev();
  //   this.expectStep(1);
  // }

  prev() {
    cy.get(this.getSelector('buttonPrev')).click();
    this.currentStep -= 1;
  }

  expectStepFinal() {
    this.expectStep(3);
  }

  setName(name: string) {
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(name);
  }

  setValue(tourPlan: TheThing, options: IOptionsTourPlanBuilderSetValue = {}) {
    const purchasePlays: TheThing[] = [];
    const purchaseAdditions: TheThing[] = [];
    const finalPurchases: Purchase[] = [];
    if (tourPlan.hasRelation(RelationNamePurchase)) {
      const relations = tourPlan.getRelations(RelationNamePurchase);
      purchasePlays.push.apply(
        purchasePlays,
        relations
          .map(
            r =>
              theMockDatabase.getEntity(
                `${TheThing.collection}/${r.objectId}`
              ) as TheThing
          )
          .filter(pl => !!pl && ImitationPlay.filter.test(pl))
      );

      for (const play of purchasePlays) {
        if (play.hasRelation(RelationAddition.name)) {
          purchaseAdditions.push.apply(
            purchaseAdditions,
            play
              .getRelationObjectIds(RelationAddition.name)
              .map(objId =>
                theMockDatabase.getEntity(`${TheThing.collection}/${objId}`)
              )
              .filter(ad => !!ad)
          );
        }
      }

      finalPurchases.push.apply(
        finalPurchases,
        this.fromRelations(tourPlan.getRelations(RelationNamePurchase))
      );
    }

    // Set date and number of participants
    this.expectStep(1);
    if (options.stopAtStep === 1) {
      return;
    }
    const dateRange = tourPlan.cells['預計出遊日期'].value;
    this.setDateRange(dateRange);
    const numParticipants = tourPlan.cells['預計參加人數'].value;
    this.setNumParticipants(numParticipants);
    if (!isEmpty(purchasePlays)) {
      this.selectPlays(purchasePlays);
    }
    if (options.stopAfterStep === 1) {
      return;
    } else {
      this.next();
    }

    // Fill in contact info
    this.expectStep(2);
    if (options.stopAtStep === 2) {
      return;
    }
    this.setContact(tourPlan.cells['聯絡資訊'].value);
    if (options.stopAfterStep === 2) {
      return;
    } else {
      this.next();
    }

    // Review final tour-plan
    this.expectStep(3);
    if (options.stopAtStep === 3) {
      return;
    }

    this.tourPlanPreviewPO.expectVisible();

    if (tourPlan.name) {
      this.tourPlanPreviewPO.setName(tourPlan.name);
    }

    if (options.hasOptionalFields) {
      // this.tourPlanPreviewPO.gotoEditOptionalCells();
      // const theThingCellsEditorPO = new TheThingCellsEditorPageObjectCypress();
      // theThingCellsEditorPO.expectVisible();
      const optionalCells = tourPlan.getCellsByNames(
        ImitationTourPlan.getOptionalCellNames()
      );
      cy.wrap(optionalCells).each((cell: any) => {
        this.tourPlanPreviewPO.addOptionalCell(cell);
      });
      // theThingCellsEditorPO.updateValue(optionalCells);
      // theThingCellsEditorPO.submit();
    }

    // Edit purchases
    if (!isEmpty(finalPurchases)) {
      const products = purchasePlays.concat(purchaseAdditions);
      const purchases: Purchase[] = products.map(p =>
        Purchase.purchase(tourPlan, p, numParticipants)
      );
      this.tourPlanPreviewPO.gotoEditPurchases();
      const cartEditorPO = new ShoppingCartEditorPageObjectCypress();
      cartEditorPO.expectVisible();
      cartEditorPO.updatePurchases(finalPurchases);
      cartEditorPO.expectPurchases(finalPurchases);
      cartEditorPO.submit();
    }

    this.expectStep(3);
    this.tourPlanPreviewPO.expectVisible();
    this.tourPlanPreviewPO.expectValue(tourPlan);

    // // Set optional fields
    // this.expectStep(4);
    // if (options.stopAtStep === 4) {
    //   return;
    // }
    // // A tour-plan without name should have this default name
    // if (!tourPlan.name) {
    //   cy.get(this.getSelector('inputName'))
    //     .invoke('val')
    //     .should('equal', defaultName(tourPlan));
    // } else {
    //   this.setName(tourPlan.name);
    // }
    // // Set optional data fields
    // const optionalCells = tourPlan.getCellsByNames(
    //   ImitationTourPlan.getOptionalCellNames()
    // );
    // if (!isEmpty(optionalCells)) {
    //   this.theThingCellsEditorPO.setValue(optionalCells);
    // }
    // if (options.stopAfterStep === 4) {
    //   return;
    // } else {
    //   this.next();
    // }
  }

  reset() {
    this.currentStep = 1;
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectStep(step: number) {
    cy.get(this.getSelectorForStep(step), { timeout: 10000 }).should(
      'be.visible'
    );
    this.currentStep = step;
  }

  selectPlays(plays: TheThing[] | string[]) {
    // this.clearSelectedPlays();
    cy.wrap(plays).each((play: any) => {
      this.selectPlay(play);
    });
  }

  next() {
    cy.get(`${this.getSelectorForStep(this.currentStep)} button.next`).click();
    this.currentStep += 1;
  }

  submitApplication() {
    cy.get(`${this.getSelector('buttonSubmitApplication')}`).click();
  }

  fromRelations(relations: TheThingRelation[]): Purchase[] {
    return relations.map(r => Purchase.fromRelation(r));
  }
}
