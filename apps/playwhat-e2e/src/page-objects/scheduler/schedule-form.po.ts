import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange, NumberRange, Contact } from '@ygg/shared/types';
import { Tags } from '@ygg/tags/core';
import { ScheduleForm } from '@ygg/playwhat/scheduler';

abstract class ScheduleFormPageObject extends PageObject {
  selectors = {
    main: '.ygg-schedule-form',
    submitButton: 'button.submit',
    agentSelector: '.agent .select',
    dateRange: '.date-range'
  }

  dateRangePageObject: DateRangePageObject;

  constructor(parentSelector: string) {
    super(parentSelector);
    this.dateRangePageObject = new DateRangePageObject(this.getSelector('dateRange'));
  }

  abstract selectAgent(agentId: string): any;
  abstract setDateRange(dateRange: DateRange): any;
  abstract setNumParticipants(numParticioants: number): any;
  abstract setNumElders(numElders: number): any;
  abstract setNumKids(numKids: number): any;
  abstract setSingleBudget(singleBudget: NumberRange): any;
  abstract setTotalBudget(totalBudget: NumberRange): any;
  abstract setContacts(contacts: Contact[]): any;
  abstract setGroupName(groupName: string): any;
  abstract setTranspotation(transpotation: string): any;
  abstract setTranspotationHelp(transpotationHelp: string): any;
  abstract setLikeTags(likeTags: Tags): any;
  abstract setLikesDescription(likesDescription: string): any;
  abstract setAccommodationHelp(accommodationHelp: string): any;
}

export class ScheduleFormPageObjectCypress extends ScheduleFormPageObject {

  setValue(scheduleForm: ScheduleForm){
    this.selectAgent(scheduleForm.agentId);
    this.setDateRange(scheduleForm.dateRange);
    this.setNumParticipants(scheduleForm.numParticipants);
    this.setNumElders(scheduleForm.numElders);
    this.setNumKids(scheduleForm.numKids);
    this.setSingleBudget(scheduleForm.singleBudget);
    this.setTotalBudget(scheduleForm.totalBudget);
    this.setContacts(scheduleForm.contacts);
    this.setGroupName(scheduleForm.groupName);
    this.setTranspotation(scheduleForm.transpotation);
    this.setTranspotationHelp(scheduleForm.transpotationHelp);
    this.setLikeTags(scheduleForm.likeTags);
    this.setLikesDescription(scheduleForm.likesDescription);
    this.setAccommodationHelp(scheduleForm.accommodationHelp);
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
}