import { keys } from 'lodash';
import { PageObject } from '@ygg/shared/test/page-object';

interface TheThingPropertyModel {
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
  properties: { [name: string]: TheThingPropertyModel | TheThingPropertyModel[] };
  validators: Function[];

  forgeTheThing(): TheThing {
    const theThing = new TheThing();
    theThing.model = this;
    return theThing;
  }
}

class TheThing {
  model: TheThingModel;
  properties: { [name: string]: any };
}

class TheThingFormPageObjectCypress extends PageObject {
  selectors = {
    main: '.the-thing-form',
    label: '.the-thing-label',
    buttonSubmit: 'button.submit'
  };

  setValue(model: TheThingModel, value: TheThing) {
    cy.wrap(keys(model.properties)).each((propertyName: string) => {
      this.switchToForm();
      const propertyModel = model.properties[propertyName];
      const controlPO = getControlPageObjectByType(
        propertyModel.type,
        this.getSelectorForPropertyControl(propertyName)
      );
      controlPO.setValue(value.properties[propertyName]);
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

  getSelectorForPropertyControl(propertyName: string): string {
    return `${this.getSelector} form .control.${propertyName}`;
  }

  getSelectorForPropertyView(propertyName: string): string {
    return `${this.getSelector} .preview .value.${propertyName}`;
  }
}

class TheThingDisplayObjectCypress extends PageObject {
  selectors = {
    main: '.the-thing-display'
  };

  getSelectorForPropertyView(name: string): string {
    return `${this.getSelector()} .${name}`;
  }

  expectValue(model: TheThingModel, value: TheThing) {
    cy.wrap(keys(model.properties)).each((propertyName: string) => {
      const propertyModel = model.properties[propertyName];
      const viewPO = getViewPageObjectByType(
        propertyModel.type,
        this.getSelectorForPropertyView(propertyName)
      );
      viewPO.expectValue(value.properties[propertyName]);
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

  it('Should show control of corresponding type of each property', () => {
    cy.wrap(keys(theThingModel.properties)).each((propertyName: string) => {
      const propertyModel = theThingModel.properties[propertyName];
      const controlPO = getControlPageObjectByType(
        propertyModel.type,
        theThingFormPO.getSelectorForPropertyControl(propertyName)
      );
      controlPO.expectExist();
    });
  });

  it('Should sync data in preview on every change', () => {
    const theThing = theThingModel.forgeTheThing();
    cy.wrap(keys(theThingModel.properties)).each((propertyName: string) => {
      theThingFormPO.switchToForm();
      const propertyModel = theThingModel.properties[propertyName];
      const controlPO = getControlPageObjectByType(
        propertyModel.type,
        theThingFormPO.getSelectorForPropertyControl(propertyName)
      );
      controlPO.setValue(theThing.properties[propertyName]);
      theThingFormPO.switchToPreview();
      const viewPO = getViewPageObjectByType(
        propertyModel.type,
        theThingFormPO.getSelectorForPropertyView(propertyName)
      );
      viewPO.expectValue(theThing.properties[propertyName]);
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
