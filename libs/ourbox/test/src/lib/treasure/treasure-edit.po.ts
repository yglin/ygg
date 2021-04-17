import { Treasure } from '@ygg/ourbox/core';
import { OmniTypeID, OmniTypes } from '@ygg/shared/omni-types/core';
import { AlbumControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { TextControlPageObjectCypress } from 'libs/shared/omni-types/test/src/lib/text';

export class TreasureEditPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-edit',
    'album-control': '.album.control',
    'name-control': '.name.control',
    'location-control': '.location.control'
  };

  nameControlPO: TextControlPageObjectCypress;
  albumControlPO: AlbumControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.nameControlPO = new TextControlPageObjectCypress(
      this.getSelector('name-control')
    );
    this.albumControlPO = new AlbumControlPageObjectCypress(
      this.getSelector('album-control')
    );
  }

  expectStep(stepName: string) {
    cy.get(`${this.getSelector()} .mat-step-label-active`).contains(stepName);
  }

  // expectHint(controlName: string, hintMessage: string) {
  //   const controlPO = this.controlPOs[controlName].pageObject;
  //   controlPO.expectHint(hintMessage);
  // }

  setValue(treasure: Treasure) {
    this.expectStep('寶物的名稱');
    this.nameControlPO.setValue(treasure.name);
    this.nextStep();
    this.expectStep('寶物的照片');
    this.albumControlPO.setValue(treasure.album);
  }

  nextStep() {
    cy.get(`${this.getSelector()} .next-step`)
      .filter(':visible')
      .scrollIntoView()
      .click();
  }

  submit() {
    cy.get(`${this.getSelector()} button.submit`)
      .scrollIntoView()
      .click();
  }
}
