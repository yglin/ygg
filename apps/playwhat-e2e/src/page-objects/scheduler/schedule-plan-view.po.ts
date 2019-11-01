import { SchedulePlan, TranspotationTypes, SchedulePlanViewPageObject } from '@ygg/playwhat/scheduler';
import { DateRange, NumberRange, Contact } from '@ygg/shared/types';
import { DateRange as DateRangePageObjects } from '../shared-types';
import { NumberRangeViewPageObjectCypress } from '../shared-types/number-range';
import { ContactViewPageObjectCypress } from '../shared-types/contact';
import { TagsViewPageObjectCypress } from '../tags';
import { Tags } from '@ygg/tags/core';

export class SchedulePlanViewPageObjectCypress extends SchedulePlanViewPageObject {
  expectValue(schedulePlan: SchedulePlan) {
    this.expectDateRange(schedulePlan.dateRange);
    this.expectNumParticipants(schedulePlan.numParticipants);
    this.expectNumElders(schedulePlan.numElders);
    this.expectNumKids(schedulePlan.numKids);
    this.expectTotalBudget(schedulePlan.totalBudget);
    this.expectSingleBudget(schedulePlan.singleBudget);
    this.expectGroupName(schedulePlan.groupName);
    this.expectContacts(schedulePlan.contacts);
    this.expectTranspotation(schedulePlan.transpotation);
    this.expectTranspotationHelp(schedulePlan.transpotationHelp);
    this.expectAccommodationHelp(schedulePlan.accommodationHelp);
    this.expectLikesTags(schedulePlan.tags);
    this.expectLikesDescription(schedulePlan.likesDescription);
  }

  expectDateRange(dateRange: DateRange) {
    const dateRangeView = new DateRangePageObjects.DateRangeViewPageObjectCypress(
      this.getSelector('dateRange')
    );
    dateRangeView.expectValue(dateRange);
  }

  expectNumParticipants(numParticipants: number) {
    cy.get(this.getSelector('numParticipants')).contains(numParticipants);
  }

  expectNumElders(numElders: number) {
    cy.get(this.getSelector('numElders')).contains(numElders);
  }

  expectNumKids(numKids: number) {
    cy.get(this.getSelector('numKids')).contains(numKids);
  }

  expectTotalBudget(budget: NumberRange) {
    const totalBudgetPageObject = new NumberRangeViewPageObjectCypress(
      this.getSelector('totalBudget')
    );
    totalBudgetPageObject.expectValue(budget);
  }

  expectSingleBudget(budget: NumberRange) {
    const singleBudgetPageObject = new NumberRangeViewPageObjectCypress(
      this.getSelector('singleBudget')
    );
    singleBudgetPageObject.expectValue(budget);
  }

  expectGroupName(groupName: string) {
    cy.get(this.getSelector('groupName')).contains(groupName);
  }

  expectContacts(contacts: Contact[]) {
    for (let index = 0; index < contacts.length; index++) {
      const contact = contacts[index];
      const contactViewPageObject = new ContactViewPageObjectCypress(
        this.getSelectorForContactAt(index)
      );
      contactViewPageObject.expectValue(contact);
    }
  }

  expectTranspotation(transpotation: string) {
    cy.get(this.getSelector('transpotation')).contains(TranspotationTypes[transpotation].label);
  }

  expectTranspotationHelp(transpotationHelp: string) {
    cy.get(this.getSelector('transpotationHelp')).contains(transpotationHelp);
  }

  expectAccommodationHelp(accommodationHelp: string) {
    cy.get(this.getSelector('accommodationHelp')).contains(accommodationHelp);
  }

  expectLikesTags(tags: Tags) {
    const tagsViewPageObject = new TagsViewPageObjectCypress(this.getSelector('likesTags'));
    tagsViewPageObject.expectValue(tags);
  }

  expectLikesDescription(likesDescription: string) {
    cy.get(this.getSelector('likesDescription')).contains(likesDescription);
  }

  gotoEdit() {
    cy.get(this.getSelector('buttonEdit')).click();
  }
}
