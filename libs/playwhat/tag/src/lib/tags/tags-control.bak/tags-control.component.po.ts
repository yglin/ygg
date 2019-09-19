import { ControlPageObject } from "@ygg/shared/infra/test-utils";
import { Tags } from '../tags';

export class TagsControlComponentPageObject extends ControlPageObject<Tags> {
  selector: '.tags-control';
  selectors = {
    label: '.label',
    inputTagName: 'input#tag-name',
    buttonAdd: 'button#add-tag',
    buttonClear: 'button#clear-all',
    tagChip: '.tag-chip',
    autocompleteDropdown: '.autocomplete-panel'
  };

  async setValue(tags: Tags) {
    this.tester.iterate<string>(tags.getNames(), async (name) => {
      this.tester.inputText(this.getSelector('inputTagName'), name);
      this.tester.clickButton(this.getSelector('buttonAdd'));
      await this.tester.wait();
      this.tester.expectVisible(`${this.getSelector('tagChip')}[tagName="${name}"]`, true);
    });
  }

  async clearAll() {
    this.tester.clickButton(this.getSelector('buttonClear'));
    await this.tester.wait();
  }

  async removeTag(name: string) {
    const deleteButtonSelector = `${this.getSelector('tagChip')}[tagName="${name}"] .delete`;
    this.tester.clickButton(deleteButtonSelector);
    await this.tester.wait();
  }

  // yglin: 2019/08/30
  // This method is useless right now,
  // because I can't get the autocomplete panel hidden as expect after clearInput().
  // It behaves normal outside test, so I'll postpone this. 
  expectAutoCompleteDropdownVisible(flag: boolean) {
    this.tester.expectVisible(this.getSelector('autocompleteDropdown'), flag);
  }

  async typeIntoName(letter: string) {
    this.tester.typeInput(this.getSelector('inputTagName'), letter);
    await this.tester.wait();
  }

  async clearInput() {
    this.tester.clearInput(this.getSelector('inputTagName'));
    await this.tester.wait();
  }

  expectAutoCompleteDropdownOptions(values: string[]) {
    for (const value of values) {
      const optionSelector = `${this.getSelector('autocompleteDropdown')} [tagName="${value}"]`;
      this.tester.expectVisible(optionSelector, true);
    }
  }
}