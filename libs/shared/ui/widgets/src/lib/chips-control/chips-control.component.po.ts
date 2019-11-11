// import { PageObjects, AngularJest } from '@ygg/shared/infra/test-utils';
import { PageObject } from "@ygg/shared/test/page-object";

export class ChipsControlPageObject extends PageObject {
  selectors = {
    main: '.chips-control',
    inputChip: 'input#chip',
    buttonAdd: 'button#add-chip',
    buttonClear: 'button#clear-all',
    chip: '.chip',
    autocompleteDropdown: '.autocomplete-panel'
  };

  getSelectorForChipDeleteButton(chip: string): string {
    return `${this.getSelector('chip')}[chipName="${chip}"] .delete`;
  }
};

// export class ChipsControlComponentPageObject<T> extends AngularJest.PageObject<T> {
//   async clearAll() {
//     return this.click('buttonClear');
//   }

//   async addChip(chip: string) {
//     await this.inputText('inputChip', chip);
//     await this.click('buttonAdd');
//     return Promise.resolve();
//   }

//   async removeChip(chip: string) {
//     const deleteButtonSelector = `${this.getSelector('chip')}[chipName="${chip}"] .delete`;
//     this.getNativeElement<HTMLElement>(deleteButtonSelector).click();
//     await this.fixture.whenStable();
//     this.fixture.detectChanges();
//     return Promise.resolve();
//   }

//   async clearInput() {
//     return this.inputText('inputChip', '');
//   }

//   async typeIntoInput(letter: string) {
//     return this.type('inputChip', letter);
//   }

//   expectAutoCompleteOptions(values: string[]) {
//     this.expectVisible('.autocomplete-panel', true);
//     for (const value of values) {
//       const optionSelector = `.autocomplete-panel [optionName="${value}"]`;
//       this.expectVisible(optionSelector, true);
//     }
//   }
// }