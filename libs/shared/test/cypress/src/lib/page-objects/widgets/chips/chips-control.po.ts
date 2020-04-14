import { ChipsControlPageObject } from '@ygg/shared/ui/widgets';

export class ChipsControlPageObjectCypress extends ChipsControlPageObject {
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
