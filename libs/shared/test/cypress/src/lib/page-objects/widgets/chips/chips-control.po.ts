import { ChipsControlPageObject } from '@ygg/shared/ui/widgets';

export class ChipsControlPageObjectCypress extends ChipsControlPageObject {
  setValue(chips: string[]) {
    cy.get(this.getSelector('buttonClear')).click({ force: true });
    cy.wrap(chips).each((chip: any) => {
      this.addChip(chip as string);
    });
  }

  addChip(chip: string) {
    cy.get(this.getSelector('inputChip'))
      .clear({ force: true })
      .type(chip);
    cy.get(this.getSelector('buttonAdd')).click();
  }
}
