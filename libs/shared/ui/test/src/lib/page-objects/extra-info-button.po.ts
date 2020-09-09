import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { EmceePageObjectCypress } from './emcee';

export class ExtraInfoButtonPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.extra-info-button',
    buttonShowInfo: 'button.show-info'
  };

  showInfo() {
    cy.get(this.getSelector('buttonShowInfo')).click();
  }

  expectInfo(info: string) {
    const emceePO = new EmceePageObjectCypress();
    emceePO.info(info);
  }
}
