import { keys } from 'lodash';
import { PageObject } from '@ygg/shared/test/page-object';

interface TheThingCellModel {
  type: string;
  label: string;
  validators: Function[];
}

abstract class TheThingCellControlPageObject extends PageObject {
  abstract expectExist(): void;
  abstract setValue(value: any): void;
}

class TheThingTextCellControlPageObjectCypress extends TheThingCellControlPageObject {
  expectExist() {
    cy.get(this.getSelector()).should('exist');
  }

  setValue(value: string) {
    cy.get(`${this.getSelector()} input`)
      .clear()
      .type(value);
  }
}

abstract class TheThingCellViewPageObject extends PageObject {
  abstract expectExist(): void;
  abstract expectValue(value: any): void;
}

class TheThingTextCellViewPageObjectCypress extends TheThingCellViewPageObject {
  expectExist() {
    cy.get(this.getSelector()).should('exist');
  }

  expectValue(value: string) {
    cy.get(`${this.getSelector()} .value`).should('include', value);
  }
}

class TheThingModel {
  static forge(): TheThingModel {
    const model = new TheThingModel();
    return model;
  }
  type: string;
  label: string;
  cellModels: { [name: string]: TheThingCellModel };
  validators: Function[];

  forgeTheThing(): TheThing {
    const theThing = new TheThing();
    theThing.model = this;
    return theThing;
  }
}

class TheThing {
  model: TheThingModel;
  cells: { [name: string]: any };
}

class TheThingFormPageObjectCypress extends PageObject {
  selectors = {
    main: '.the-thing-form',
    label: '.the-thing-label',
    buttonSubmit: 'button.submit'
  };

  setValue(model: TheThingModel, value: TheThing) {
    cy.wrap(keys(model.cellModels)).each((cellName: string) => {
      this.switchToForm();
      const cellModel = model.cellModels[cellName];
      const controlPO = getControlPageObjectByType(
        cellModel.type,
        this.getSelectorForCellControl(cellName)
      );
      controlPO.setValue(value.cells[cellName]);
    });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }

  switchToForm() {
    cy.get(this.getSelector('buttonSwitchForm')).click();
  }

  switchToPreview() {
    cy.get(this.getSelector('buttonSwitchPreview')).click();
  }

  getSelectorForCellControl(cellName: string): string {
    return `${this.getSelector} form .control.${cellName}`;
  }

  getSelectorForCellView(cellName: string): string {
    return `${this.getSelector} .preview .value.${cellName}`;
  }
}

class TheThingDisplayObjectCypress extends PageObject {
  selectors = {
    main: '.the-thing-display'
  };

  getSelectorForCellView(name: string): string {
    return `${this.getSelector()} .${name}`;
  }

  expectValue(model: TheThingModel, value: TheThing) {
    cy.wrap(keys(model.cellModels)).each((cellName: string) => {
      const cellModel = model.cellModels[cellName];
      const viewPO = getViewPageObjectByType(
        cellModel.type,
        this.getSelectorForCellView(cellName)
      );
      viewPO.expectValue(value.cells[cellName]);
    });
  }
}

function getControlPageObjectByType(
  type: string,
  parentSelector: string = ''
): TheThingCellControlPageObject {
  return new TheThingTextCellControlPageObjectCypress(parentSelector);
}

function getViewPageObjectByType(
  type: string,
  parentSelector: string = ''
): TheThingCellViewPageObject {
  return new TheThingTextCellViewPageObjectCypress(parentSelector);
}

describe('Generate form from the-thing model', () => {
  let theThingModel = TheThingModel.forge();
  const theThingFormPO = new TheThingFormPageObjectCypress();

  it('Should show label of the-thing', () => {
    cy.get(theThingFormPO.getSelector('label')).contains(theThingModel.label);
  });

  it('Should show control of corresponding type of each cell', () => {
    cy.wrap(keys(theThingModel.cellModels)).each((cellName: string) => {
      const cellModel = theThingModel.cellModels[cellName];
      const controlPO = getControlPageObjectByType(
        cellModel.type,
        theThingFormPO.getSelectorForCellControl(cellName)
      );
      controlPO.expectExist();
    });
  });

  it('Should sync data in preview on every change', () => {
    const theThing = theThingModel.forgeTheThing();
    cy.wrap(keys(theThingModel.cellModels)).each((cellName: string) => {
      theThingFormPO.switchToForm();
      const cellModel = theThingModel.cellModels[cellName];
      const controlPO = getControlPageObjectByType(
        cellModel.type,
        theThingFormPO.getSelectorForCellControl(cellName)
      );
      controlPO.setValue(theThing.cells[cellName]);
      theThingFormPO.switchToPreview();
      const viewPO = getViewPageObjectByType(
        cellModel.type,
        theThingFormPO.getSelectorForCellView(cellName)
      );
      viewPO.expectValue(theThing.cells[cellName]);
    });
  });

  it('Check data consistency after submitted', () => {
    const theThing = theThingModel.forgeTheThing();
    theThingFormPO.setValue(theThingModel, theThing);
    theThingFormPO.submit();
    const theThingDisplayPO = new TheThingDisplayObjectCypress('');
    cy.get(theThingDisplayPO.getSelector(), { timeout: 10000 }).should('exist');
    theThingDisplayPO.expectValue(theThing);
  });
});
