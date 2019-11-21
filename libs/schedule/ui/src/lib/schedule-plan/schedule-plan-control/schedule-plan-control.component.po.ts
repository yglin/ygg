import { PageObject } from '@ygg/shared/test/page-object';
import { DateRange, NumberRange, Contact } from '@ygg/shared/types';
import { Tags } from '@ygg/tags/core';

export abstract class SchedulePlanControlPageObject extends PageObject {
  selectors = {
    main: '.ygg-schedule-plan-control',
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
    textareaAccommodationHelp:
      '.form-control.miscellaneous textarea.accommodation-help',
    totalPrice: '.price',
    playSelector: '.play-selector',
    shoppingCart: '.shopping-cart'
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
