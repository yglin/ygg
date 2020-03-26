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
import {
  ImitationTourPlan,
  defaultName,
  ImitationPlay
} from '@ygg/playwhat/core';
import { TourPlanViewPageObjectCypress } from '../tour-plan-view.po';
import {
  Purchase,
  RelationAddition,
  CellNameStock,
  RelationNamePurchase,
  CellNameQuantity
} from '@ygg/shopping/core';
import { isEmpty, find, values } from 'lodash';

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
    this.theThingCellsEditorPO = new TheThingCellsEditorPageObjectCypress(
      this.getSelector('optionalCellsEditor')
    );
    this.cartEditorPO = new ShoppingCartEditorPageObjectCypress(
      this.getSelector('shoppingCart')
    );
    this.tourPlanPreviewPO = new TourPlanViewPageObjectCypress(
      this.getSelector('preview')
    );
  }

  setName(name: string) {
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(name);
  }

  setValue(tourPlan: TheThing, options: any = {}) {
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

    // Edit purchases
    this.expectStep(3);
    if (options.stopAtStep === 3) {
      return;
    }
    if (!isEmpty(finalPurchases)) {
      const products = purchasePlays.concat(purchaseAdditions);
      const purchases: Purchase[] = products.map(p =>
        Purchase.purchase(tourPlan, p, numParticipants)
      );
      this.cartEditorPO.expectPurchases(purchases);
      this.cartEditorPO.setPurchases(finalPurchases);
      this.cartEditorPO.expectPurchases(finalPurchases);
    }
    if (options.stopAfterStep === 3) {
      return;
    } else {
      this.next();
    }

    this.expectStep(4);
    if (options.stopAtStep === 4) {
      return;
    }
    // A tour-plan without name should have this default name
    if (!tourPlan.name) {
      cy.get(this.getSelector('inputName'))
        .invoke('val')
        .should('equal', defaultName(tourPlan));
    } else {
      this.setName(tourPlan.name);
    }
    // Set optional data fields
    const optionalCells = tourPlan.getCellsByNames(
      ImitationTourPlan.getOptionalCellNames()
    );
    if (!isEmpty(optionalCells)) {
      this.theThingCellsEditorPO.setValue(optionalCells);
    }
    if (options.stopAfterStep === 4) {
      return;
    } else {
      this.next();
    }

    // Review final tour-plan
    this.expectStep(5);
    if (options.stopAtStep === 5) {
      return;
    }
    this.tourPlanPreviewPO.expectVisible();
    this.tourPlanPreviewPO.expectValue(tourPlan);
  }

  reset() {
    this.currentStep = 1;
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectStep(step: number) {
    cy.get(this.getSelectorForStep(step)).should('be.visible');
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

  skipToFinalStep() {
    this.next();
    this.next();
    this.next();
    this.next();
  }

  submit() {
    cy.get(`${this.getSelector('buttonSubmit')}`).click();
    // wait for redirect to view page
    cy.location('pathname', { timeout: 10000 }).should(
      'match',
      /the-things\/[^\/]+/
    );
  }

  fromRelations(relations: TheThingRelation[]): Purchase[] {
    return relations.map(r => Purchase.fromRelation(r));
  }
}
