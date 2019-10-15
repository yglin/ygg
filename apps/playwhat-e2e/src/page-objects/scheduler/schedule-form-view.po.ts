import { PageObject } from '@ygg/shared/test/page-object';
import { ScheduleForm } from '@ygg/playwhat/scheduler';
import { DateRange } from '@ygg/shared/types';
import { DateRange as DateRangePageObjects } from "../shared-types";

export abstract class ScheduleFormViewPageObject extends PageObject{
  selectors = {
    main: '.ygg-schedule-form-view',
    dateRange: '.date-range',
    numParticipants: '.numberPeople .numParticipants',
    numElders: '.numberPeople .numElders',
    numKids: '.numberPeople .numKids',
  }

  abstract expectValue(scheduleForm: ScheduleForm): any;
}

export class ScheduleFormViewPageObjectCypress extends ScheduleFormViewPageObject {

  expectValue(scheduleForm: ScheduleForm) {
    this.expectDateRange(scheduleForm.dateRange);
    this.expectNumParticipants(scheduleForm.numParticipants);
    this.expectNumElders(scheduleForm.numElders);
    this.expectNumKids(scheduleForm.numKids);
    // this.expectTotalBudget(scheduleForm.totalBudget);
    // this.expectSingleBudget(scheduleForm.singleBudget);
    // this.expectGroupName(scheduleForm.groupName);
    // this.expectContacts(scheduleForm.contacts);
    // this.expectTranspotation(scheduleForm.transpotation);
    // this.expectTranspotationHelp(scheduleForm.transpotationHelp);
    // this.expectAccommodationHelp(scheduleForm.accommodationHelp);
    // this.expectLikesTags(scheduleForm.tags);
    // this.expectLikesDescription(scheduleForm.likesDescription);
  }

  expectDateRange(dateRange: DateRange) {
    const dateRangeView = new DateRangePageObjects.DateRangeViewPageObjectCypress(this.getSelector('dateRange'));
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
}