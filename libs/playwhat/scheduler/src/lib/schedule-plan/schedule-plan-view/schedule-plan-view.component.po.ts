import { PageObject } from '@ygg/shared/test/page-object';
import { SchedulePlan } from '../schedule-plan';

export abstract class SchedulePlanViewPageObject extends PageObject {
  selectors = {
    main: '.ygg-schedule-plan-view',
    dateRange: '.date-range',
    numParticipants: '.numberPeople .numParticipants',
    numElders: '.numberPeople .numElders',
    numKids: '.numberPeople .numKids',
    totalBudget: '.budget .total-budget',
    singleBudget: '.budget .single-budget',
    groupName: '.contacts .group-name',
    contacts: '.contacts',
    transpotation: '.transpotation .transpotation-type',
    transpotationHelp: '.transpotation .transpotation-help',
    accommodationHelp: '.miscellaneous .accommodation-help',
    likesTags: '.likes .tags',
    likesDescription: '.likes .description',
    buttonEdit: 'button.edit'
  };

  getSelectorForContactAt(index: number): string {
    return `${this.getSelector('contacts')} [index="${index}"]`;
  }

  abstract expectValue(schedulePlan: SchedulePlan): any;
}

