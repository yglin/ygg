import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange, NumberRange, Contact } from '@ygg/shared/types';
import { Tags } from '@ygg/tags/core';
import { ScheduleForm } from '@ygg/playwhat/scheduler';
import { DateRangePickerPageObjectCypress } from '../shared-types/date-range';
import { NumberRangeControlPageObjectCypress } from '../shared-types/number-range';
import { ContactControlPageObjectCypress } from '../shared-types/contact';
import { TagsControlPageObjectCypress } from '../tags';

abstract class ScheduleFormPageObject extends PageObject {
  selectors = {
    main: '.ygg-schedule-form',
    submitButton: 'button.submit',
    agentSelector: '.agent .select',
    dateRange: '.date-range',
    inputNumParticipants: '.num-participants input',
    inputNumKids: '.num-kids input',
    inputNumElders: '.num-elders input',
    totalBudgetRadioButton:
      '.budget-radio-group .total-budget input[type="radio"]',
    singleBudgetRadioButton:
      '.budget-radio-group .single-budget input[type="radio"]',
    totalBudget: '.total-budget',
    singleBudget: '.single-budget',
    buttonClearContacts: 'button.clear-contacts',
    buttonAddContact: 'button.add-contact',
    inputGroupName: '.group-name input',
    transpotationRadioGroup: '.transpotation .radio-group',
    transpotationHelp: '.transpotation textarea.transpotation-help',
    likesTags: '.form-control.likes',
    textareaLikesDescription: '.form-control.likes textarea.likes-description',
    textareaAccommodationHelp: '.form-control.miscellaneous textarea.accommodation-help'
  };

  getSelectorForPanelHeader(panelSelector: string): string {
    return `${this.getSelector()} .panel-header ${panelSelector}`;
  }

  getSelectorForTranspotationRadioButton(value: string): string {
    return `${this.getSelector(
      'transpotationRadioGroup'
    )} [transpotation="${value}"] input[type="radio"]`;
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
  abstract setLikeTags(tags: Tags): any;
  abstract setLikesDescription(likesDescription: string): any;
  abstract setAccommodationHelp(accommodationHelp: string): any;
}

export class ScheduleFormPageObjectCypress extends ScheduleFormPageObject {
  dateRangePageObject: DateRangePickerPageObjectCypress;
  totalBudgetPageObject: NumberRangeControlPageObjectCypress;
  singleBudgetPageObject: NumberRangeControlPageObjectCypress;
  tagsControlPageObject: TagsControlPageObjectCypress;

  constructor(parentSelector: string) {
    super(parentSelector);
    this.dateRangePageObject = new DateRangePickerPageObjectCypress(
      this.getSelector('dateRange')
    );
    this.totalBudgetPageObject = new NumberRangeControlPageObjectCypress(
      this.getSelector('totalBudget')
    );
    this.singleBudgetPageObject = new NumberRangeControlPageObjectCypress(
      this.getSelector('singleBudget')
    );
    this.tagsControlPageObject = new TagsControlPageObjectCypress(
      this.getSelector('likesTags')
    );
  }

  setValue(scheduleForm: ScheduleForm) {
    if (scheduleForm.agentId) {
      this.selectAgent(scheduleForm.agentId);
    }
    this.setDateRange(scheduleForm.dateRange);
    // open panel num-people
    cy.get(this.getSelectorForPanelHeader('.num-people')).click();
    this.setNumParticipants(scheduleForm.numParticipants);
    this.setNumElders(scheduleForm.numElders);
    this.setNumKids(scheduleForm.numKids);
    // open panel budget
    cy.get(this.getSelectorForPanelHeader('.budget')).click();
    this.setSingleBudget(scheduleForm.singleBudget);
    this.setTotalBudget(scheduleForm.totalBudget);
    // open contacts panel
    cy.get(this.getSelectorForPanelHeader('.contacts')).click();
    this.setGroupName(scheduleForm.groupName);
    this.setContacts(scheduleForm.contacts);
    // open transpotation panel
    cy.get(this.getSelectorForPanelHeader('.transpotation')).click();
    this.setTranspotation(scheduleForm.transpotation);
    this.setTranspotationHelp(scheduleForm.transpotationHelp);
    // open likes panel
    cy.get(this.getSelectorForPanelHeader('.likes')).click();
    this.setLikeTags(scheduleForm.tags);
    this.setLikesDescription(scheduleForm.likesDescription);
    // open miscellaneous panel
    cy.get(this.getSelectorForPanelHeader('.miscellaneous')).click();
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

  setSingleBudget(singleBudget: NumberRange) {
    // Switch to single budget control
    cy.get(this.getSelector('singleBudgetRadioButton')).check({ force: true });
    this.singleBudgetPageObject.setValue(singleBudget);
  }

  setTotalBudget(totalBudget: NumberRange) {
    // Switch to total budget control
    cy.get(this.getSelector('totalBudgetRadioButton')).check({ force: true });
    this.totalBudgetPageObject.setValue(totalBudget);
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

  setLikeTags(tags: Tags) {
    this.tagsControlPageObject.setValue(tags);
  }

  setLikesDescription(likesDescription: string) {
    cy.get(this.getSelector('textareaLikesDescription')).clear().type(likesDescription);
  }

  setAccommodationHelp(accommodationHelp: string) {
    cy.get(this.getSelector('textareaAccommodationHelp')).clear().type(accommodationHelp);
  }
}
