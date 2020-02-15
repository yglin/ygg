import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';
import { DateRangeControlPageObject, ContactControlPageObject, NumberControlPageObject} from '@ygg/shared/omni-types/ui';
import { DateRange, Contact } from '@ygg/shared/omni-types/core';

export class TourPlanBuilderPageObject extends PageObject {
  selectors = {
    main: '.tour-plan-builder',
    playList: '.step1 .play-list',
    dateRangeControl: '.step1 .date-range',
    numParticipantsControl: '.step1 .num-participants',
    contactControl: '.step2 .contact-control',
    buttonSubmit: 'button.submit'
  };

  currentStep = 1;
  
  playListPO: ImageThumbnailListPageObject;
  dateRangeControl: DateRangeControlPageObject;
  numParticipantsControl: NumberControlPageObject;
  contactControlPO: ContactControlPageObject;

  getSelectorForStep(step: number): string {
    return `${this.getSelector()} [step="${step}"]`;
  }

  clearSelectedPlays() {
    this.playListPO.clearSelection();
  }

  selectPlay(play: TheThing) {
    this.playListPO.selectItem(play);
  }

  setDateRange(dateRange: DateRange) {
    this.dateRangeControl.setValue(dateRange);
  }

  setNumParticipants(numParticipants: number) {
    this.numParticipantsControl.setValue(numParticipants);
  }

  setContact(contact: Contact) {
    this.contactControlPO.setValue(contact);
  }
}
