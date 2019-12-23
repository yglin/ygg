import { last } from 'lodash';
import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange, NumberRange, Contact } from '@ygg/shared/types';
import { Tags } from '@ygg/tags/core';
import { SchedulePlan } from '@ygg/schedule/core';
import { DateRangeControlPageObjectCypress } from '../shared-types/date-range';
import { DayTimeRangeControlPageObjectCypress } from "../shared-types/day-time-range";
import { NumberRangeControlPageObjectCypress } from '../shared-types/number-range';
import { ContactControlPageObjectCypress } from '../shared-types/contact';
import { TagsControlPageObjectCypress } from '../tags';
import { SchedulePlanControlPageObject } from '@ygg/schedule/ui';
import { ShoppingCartPageObjectCypress } from '../../page-objects/shopping';
import { PlaySelectorPageObjectCypress } from '../play';
import { Purchase } from '@ygg/shopping/core';

export class SchedulePlanControlPageObjectCypress extends SchedulePlanControlPageObject {
  dateRangePageObject: DateRangeControlPageObjectCypress;
  dayTimeRangeControlPO: DayTimeRangeControlPageObjectCypress;
  totalBudgetPageObject: NumberRangeControlPageObjectCypress;
  singleBudgetPageObject: NumberRangeControlPageObjectCypress;
  tagsControlPageObject: TagsControlPageObjectCypress;
  playSelectorPageObject: PlaySelectorPageObjectCypress;
  shoppingCartPageObject: ShoppingCartPageObjectCypress;

  constructor(parentSelector: string) {
    super(parentSelector);
    this.dateRangePageObject = new DateRangeControlPageObjectCypress(
      this.getSelector('dateRange')
    );
    this.dayTimeRangeControlPO = new DayTimeRangeControlPageObjectCypress(
      this.getSelector('dayTimeRange')
    );
    this.totalBudgetPageObject = new NumberRangeControlPageObjectCypress(
      this.getSelector('totalBudget')
    );
    this.singleBudgetPageObject = new NumberRangeControlPageObjectCypress(
      this.getSelector('singleBudget')
    );
    this.playSelectorPageObject = new PlaySelectorPageObjectCypress(
      this.getSelector('playSelector')
    );
    this.shoppingCartPageObject = new ShoppingCartPageObjectCypress(
      this.getSelector('shoppingCart')
    );
    this.tagsControlPageObject = new TagsControlPageObjectCypress(
      this.getSelector('likesTags')
    );
  }

  setValue(schedulePlan: SchedulePlan) {
    if (schedulePlan.agentId) {
      this.selectAgent(schedulePlan.agentId);
    }
    this.setDateRange(schedulePlan.dateRange);
    this.dayTimeRangeControlPO.setValue(schedulePlan.dayTimeRange);

    this.setNumParticipants(schedulePlan.numParticipants);
    this.setNumElders(schedulePlan.numElders);
    this.setNumKids(schedulePlan.numKids);
    this.setNumDriverOrLeader(schedulePlan.numDriverOrLeader);

    this.setSingleBudget(schedulePlan.singleBudget);
    // this.setTotalBudget(schedulePlan.totalBudget);

    this.setGroupName(schedulePlan.groupName);
    this.setContacts(schedulePlan.contacts);

    this.setTranspotation(schedulePlan.transpotation);
    this.setTranspotationHelp(schedulePlan.transpotationHelp);

    // this.setLikeTags(schedulePlan.tags);
    // Purchases
    this.setPurchases(schedulePlan.purchases);

    this.setLikesDescription(schedulePlan.likesDescription);
    this.setAccommodationHelp(schedulePlan.accommodationHelp);
    this.setMealsRequest(schedulePlan.mealsRequest);
  }

  clearValue(schedulePlan: SchedulePlan) {
    // Discard likeTags for now
    // if (schedulePlan.tags) {
    //   this.clearLikeTags();
    // }
  }

  submit() {
    cy.get(this.getSelector('submitButton')).click();
  }

  selectAgent(agentId: string) {
    cy.get(this.getSelector('agentSelector')).select(agentId);
  }

  setDateRange(dateRange: DateRange) {
    this.dateRangePageObject.setValue(dateRange);
  }

  setNumParticipants(numParticipants: number) {
    cy.get(this.getSelector('inputNumParticipants'))
      .clear()
      .type(numParticipants.toString());
  }

  setNumElders(numElders: number) {
    cy.get(this.getSelector('inputNumElders'))
      .clear()
      .type(numElders.toString());
  }

  setNumKids(numKids: number) {
    cy.get(this.getSelector('inputNumKids'))
      .clear()
      .type(numKids.toString());
  }

  setNumDriverOrLeader(numDriverOrLeader: number) {
    cy.get(this.getSelector('inputNumDriverOrLeader'))
      .clear()
      .type(numDriverOrLeader.toString());
  }

  setSingleBudget(singleBudget: NumberRange) {
    // Switch to single budget control
    cy.get(this.getSelector('singleBudgetRadioButton')).check({ force: true });
    this.singleBudgetPageObject.setValue(singleBudget);
  }

  expectSingleBudget(singleBudget: NumberRange) {
    cy.get(this.getSelector('singleBudgetRadioButton')).check({ force: true });
    this.singleBudgetPageObject.expectValue(singleBudget);
  }

  setTotalBudget(totalBudget: NumberRange) {
    // Switch to total budget control
    cy.get(this.getSelector('totalBudgetRadioButton')).check({ force: true });
    this.totalBudgetPageObject.setValue(totalBudget);
  }

  expectTotalBudget(totalBudget: NumberRange) {
    cy.get(this.getSelector('totalBudgetRadioButton')).check({ force: true });
    this.totalBudgetPageObject.expectValue(totalBudget);
  }

  getSelectorForLastContactControl(): string {
    return `${this.getSelector()} .contact-control.last`;
  }

  clearAllContacts() {
    cy.get(this.getSelector('buttonClearContacts')).click();
  }

  addNewContact(contact: Contact) {
    cy.get(this.getSelector('buttonAddContact')).click();
    const contactControlPageObject = new ContactControlPageObjectCypress(
      this.getSelectorForLastContactControl()
    );
    contactControlPageObject.setValue(contact);
  }

  setContacts(contacts: Contact[]) {
    this.clearAllContacts();
    cy.wrap(contacts).each((element, index, array) => {
      const contact = contacts[index];
      this.addNewContact(contact);
    });
  }

  setGroupName(groupName: string) {
    cy.get(this.getSelector('inputGroupName'))
      .clear()
      .type(groupName);
  }

  setTranspotation(transpotation: string) {
    cy.get(this.getSelectorForTranspotationRadioButton(transpotation)).check({
      force: true
    });
  }

  setTranspotationHelp(transpotationHelp: string) {
    cy.get(this.getSelector('transpotationHelp'))
      .clear()
      .type(transpotationHelp);
  }

  clearLikeTags() {
    this.tagsControlPageObject.clear();
  }

  setLikeTags(tags: Tags) {
    this.tagsControlPageObject.setValue(tags);
  }

  setLikesDescription(likesDescription: string) {
    cy.get(this.getSelector('textareaLikesDescription'))
      .clear()
      .type(likesDescription)
      .should('have.value', likesDescription);
  }

  setAccommodationHelp(accommodationHelp: string) {
    cy.get(this.getSelector('textareaAccommodationHelp'))
      .clear()
      .type(accommodationHelp)
      .should('have.value', accommodationHelp);
  }

  expectTotalPrice(totalPrice: number) {
    cy.get(this.getSelector('totalPrice')).contains(totalPrice.toString());
  }

  setPurchases(purchases: Purchase[]) {
    this.shoppingCartPageObject.clear();
    cy.wrap(purchases)
      .each((purchase: Purchase) => {
        this.playSelectorPageObject.clickPlayById(purchase.productId);
        // cy.pause();
        this.shoppingCartPageObject.setPurchase(purchase);
      })
      .then(() => {
        this.shoppingCartPageObject.expectPurchases(purchases);
      });
  }

  setMealsRequest(mealsRequest: string) {
    cy.get(this.getSelector('mealsRequest')).clear().type(mealsRequest);
  }
}
