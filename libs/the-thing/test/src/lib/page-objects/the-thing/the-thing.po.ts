import {
  OmniTypeViewControlPageObjectCypress,
  ImageUploaderPageObjectCypress
} from '@ygg/shared/omni-types/test';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import {
  TheThing,
  TheThingCell,
  TheThingCellDefine,
  Relationship,
  TheThingAction,
  TheThingImitation
} from '@ygg/the-thing/core';
import {
  CellCreatorPageObjectCypress,
  TheThingThumbnailPageObjectCypress
} from '@ygg/the-thing/test';
import { TheThingPageObject } from '@ygg/the-thing/ui';
import { values } from 'lodash';
import { TheThingStatePageObjectCypress } from './the-thing-state.po';
import isURL from 'validator/es/lib/isURL';
import { Album, Location, OmniTypeID } from '@ygg/shared/omni-types/core';
import { Tags } from '@ygg/tags/core';
import {
  TagsControlPageObjectCypress,
  TagsViewPageObjectCypress
} from '@ygg/tags/test';

export class TheThingPageObjectCypress extends TheThingPageObject {
  constructor(parentSelector: string, imitation: TheThingImitation) {
    super(parentSelector, imitation);
    this.statePO = new TheThingStatePageObjectCypress(
      this.getSelector('state')
    );
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectName(value: string): void {
    cy.get(this.getSelector('name')).contains(value);
  }

  expectValue(theThing: TheThing): void {
    this.expectName(theThing.name);
    this.expectImage(theThing.image);
    cy.wrap(values(theThing.cells)).each((cell: TheThingCell) => {
      cy.get(this.getSelectorForCell(cell))
        .scrollIntoView()
        .should('be.visible');
      const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
        this.getSelectorForCell(cell)
      );
      omniTypeViewControlPO.expectValue(cell.type, cell.value);
    });
  }

  expectNoElement(elementName: string) {
    cy.get(this.getSelector(elementName)).should('not.be.visible');
  }

  setCell(cell: TheThingCell) {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.id)
    );
    omniTypeViewControlPO.setValue(cell.type, cell.value);
  }

  setImage(imageUrl: string) {
    cy.get(this.getSelector('buttonOpenImageUploader')).click();
    const imageUploaderPO = new ImageUploaderPageObjectCypress();
    imageUploaderPO.addImageUrl(imageUrl);
    imageUploaderPO.submit();
    this.expectImage(imageUrl);
  }

  setAlbumCoverAsImage(album: Album) {
    cy.get(this.getSelector('buttonSetImageFromAlbumCover')).click();
  }

  expectImage(imageUrl: string) {
    cy.get(this.getSelector('mainImage')).should('have.attr', 'src', imageUrl);
  }

  setValue(theThing: TheThing) {
    if (isURL(theThing.image)) {
      this.setImage(theThing.image);
    }
    this.setName(theThing.name);

    const orderedRequiredCells = theThing.getCellsByNames(
      this.imitation.getRequiredCellIds()
    );

    cy.wrap(orderedRequiredCells).each((cell: TheThingCell, index: number) =>
      this.setCell(cell)
    );

    const additionalCells = this.imitation.pickNonRequiredCells(
      values(theThing.cells)
    );

    cy.wrap(additionalCells).each((cell: any) => {
      this.addCell(cell);
      this.expectCell(cell);
    });
  }

  expectCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.id)}`).contains(cell.label);
    this.expectCellValue(cell.id, cell.type, cell.value);
  }

  expectCellValue(cellId: string, cellType: OmniTypeID, value: any) {
    const cellViewPagePO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cellId)
    );
    cellViewPagePO.expectValue(cellType, value);
  }

  expectNoCell(cell: TheThingCell): void {
    cy.get(`${this.getSelectorForCell(cell.id)}`).should('not.be.visible');
  }

  addCell(cell: TheThingCell) {
    cy.get(this.getSelector('buttonAddCell')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    dialogPO.expectVisible();
    const cellCreatorPO = new CellCreatorPageObjectCypress(
      dialogPO.getSelector(),
      values(this.imitation.cellsDef)
    );
    cellCreatorPO.setCell(cell);
    // cellCreatorPO.setCellValue(cell);
    dialogPO.confirm();
    dialogPO.expectClosed();
  }

  setName(name: any) {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelector('name')
    );
    omniTypeViewControlPO.setValue('text', name, { validate: false });
    this.expectName(name);
  }

  clickSave(): void {
    cy.get(this.getSelector('buttonSave')).click();
  }

  save(theThing: TheThing) {
    this.clickSave();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`確定要儲存 ${theThing.name} ？`);
    emceePO.alert(`已成功儲存 ${theThing.name}`);
  }

  expectFreshNew() {
    this.expectError(
      this.getSelector('name'),
      `請填入${this.imitation.name}名稱`
    );
    const firstRequiredCell: TheThingCellDefine = this.imitation.getFirstRequiredCellDef();
    this.expectError(
      this.getSelectorForCell(firstRequiredCell.id),
      `請填入${firstRequiredCell.label}資料`
    );
    // Only show first required cell, hide others
    for (const key in this.imitation.cellsDef) {
      if (this.imitation.cellsDef.hasOwnProperty(key)) {
        const cellDef = this.imitation.cellsDef[key];
        if (cellDef.id !== firstRequiredCell.id) {
          cy.get(this.getSelectorForCell(cellDef.id)).should('not.be.visible');
        }
      }
    }
  }

  expectError(selector: string, errorMessage: string) {
    cy.get(selector).should('include.text', errorMessage);
  }

  expectAdditions(additions: TheThing[]) {
    const additionListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('additionList')
    );
    additionListPO.expectItems(additions);
  }

  expectNoCells(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: TheThingCell) => {
      cy.get(this.getSelectorForCell(cell)).should('not.be.visible');
    });
  }

  // expectEquipments(equipments: TheThing[]) {
  //   cy.wrap(equipments).each((equip: TheThing) => {
  //     const equipSelector = this.getSelectorForEquipment(equip);
  //     const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //       equipSelector,
  //       ImitationEquipment
  //     );
  //     theThingThumbnailPO.expectValue(equip);
  //   });
  // }

  gotoCreateRelationObject(relationship: Relationship): void {
    cy.get(this.getSelectorForRelationCreateButton(relationship.name)).click();
  }

  expectRelationObjects(relationship: Relationship, objects: TheThing[]): void {
    cy.wrap(objects).each((obj: TheThing) => {
      const objectSelector = this.getSelectorForRelationObject(
        relationship.name,
        obj
      );
      const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
        objectSelector,
        relationship.imitation
      );
      theThingThumbnailPO.expectValue(obj);
    });
  }

  deleteCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCellDeleteButton(cell.id)).click();
  }

  runAction(action: TheThingAction) {
    cy.get(this.getSelectorForActionButton(action), { timeout: 10000 }).click();
  }

  expectActionButton(action: TheThingAction) {
    cy.get(this.getSelectorForActionButton(action), { timeout: 10000 }).should(
      'be.visible'
    );
  }

  expectNoActionButton(action: TheThingAction) {
    cy.get(this.getSelectorForActionButton(action)).should('not.be.visible');
  }

  expectModifiable(): void {
    cy.get(this.getSelectorForModifyButtons()).should('be.visible');
  }

  expectReadonly(): void {
    cy.get(this.getSelectorForModifyButtons()).should('not.be.visible');
  }

  openTagsEdit() {
    cy.get(this.getSelector('buttonEditTags')).click();
  }

  setTags(tags: Tags) {
    this.openTagsEdit();
    const dialogPO = new YggDialogPageObjectCypress();
    const tagsControlPO = new TagsControlPageObjectCypress(
      dialogPO.getSelector()
    );
    tagsControlPO.setValue(tags);
    dialogPO.confirm();
  }

  expectTags(tags: Tags) {
    const tagsViewPO = new TagsViewPageObjectCypress(this.getSelector('tags'));
    tagsViewPO.expectValue(tags);
  }

  expectNoTagsEditButton() {
    cy.get(this.getSelector('buttonEditTags')).should('not.be.visible');
  }
}
