import { Treasure } from '@ygg/ourbox/core';
import {
  AlbumControlPageObjectCypress,
  NumberControlPageObjectCypress,
  TextControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { TagsControlPageObjectCypress } from '@ygg/shared/tags/test';
import {
  MaterialSelectPageObjectCypress,
  PageObjectCypress
} from '@ygg/shared/test/cypress';

export class TreasureEditPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-edit',
    'album-control': '.album.control',
    'name-control': '.name.control',
    'location-control': '.location.control',
    'tags-control': '.tags-control',
    'provision-selector': '.provision-selector',
    priceInput: '.price-input'
  };

  nameControlPO: TextControlPageObjectCypress;
  albumControlPO: AlbumControlPageObjectCypress;
  tagsControlPO: TagsControlPageObjectCypress;
  provisionSelector: MaterialSelectPageObjectCypress;
  priceInputPO: NumberControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.nameControlPO = new TextControlPageObjectCypress(
      this.getSelector('name-control')
    );
    this.albumControlPO = new AlbumControlPageObjectCypress(
      this.getSelector('album-control')
    );

    this.tagsControlPO = new TagsControlPageObjectCypress(
      this.getSelector('tags-control')
    );

    this.provisionSelector = new MaterialSelectPageObjectCypress(
      this.getSelector('provision-selector')
    );

    this.priceInputPO = new NumberControlPageObjectCypress(
      this.getSelector('priceInput')
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
    this.expectStep('寶物名稱');
    this.nameControlPO.setValue(treasure.name);
    this.nextStep();
    this.expectStep('寶物照片');
    this.albumControlPO.setValue(treasure.album);
    this.nextStep();
    this.expectStep('供給方式');
    this.provisionSelector.selectByValue(treasure.provision.value);
    if (treasure.provision.isEqual(Treasure.provisionTypes[2])) {
      this.priceInputPO.expectVisible();
      this.priceInputPO.setValue(treasure.price);
    }
    this.nextStep();
    this.expectStep('寶物標籤');
    this.tagsControlPO.setValue(treasure.tags);
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
