import { PageObjectCypress } from "@ygg/shared/test/cypress";

export class ChipsControlPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.chips-control',
    inputChip: 'input#chip',
    buttonAdd: 'button#add-chip',
    buttonClear: 'button#clear-all',
    chip: '.chip',
    autocompleteDropdown: '.autocomplete-panel'
  };

  getSelectorForChip(chip: string): string {
    return `${this.getSelector('chip')}[chipName="${chip}"]`;
  }

  getSelectorForChipDeleteButton(chip: string): string {
    return `${this.getSelector('chip')}[chipName="${chip}"] .delete`;
  }

  clear() {
    cy.get(this.getSelector('buttonClear')).click({ force: true });
  }

  addValue(chips: string[]) {
    cy.wrap(chips).each((chip: any) => {
      this.addChip(chip as string);
    });
  }

  setValue(chips: string[]) {
    this.clear();
    this.addValue(chips);
  }

  expectValue(chips: string[]) {
    cy.wrap(chips).each((chip: any) => {
      cy.get(this.getSelectorForChip(chip)).should('exist');
    });
  }

  addChip(chip: string) {
    cy.get(this.getSelector('inputChip'))
      .clear({ force: true })
      .type(chip);
    cy.get(this.getSelector('buttonAdd')).click();
  }
}
