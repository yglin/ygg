import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { Album, Image } from '@ygg/shared/types';
import { login, MockDatabase } from '@ygg/shared/test/cypress';
import { littlePenguin, kiwi, kakapo } from './australia-birbs';
import { Sam, Frodo, Gollum } from './hobbits';
import {
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress,
  getCreatedTheThingId
} from '@ygg/the-thing/test';

const mockDatabase = new MockDatabase();

describe('Edit exist the-thing', () => {
  const theThingEditorPO = new TheThingEditorPageObjectCypress();

  before(() => {
    login();
    // mockDatabase.insert(
    //   `${TheThing.collection}/${littlePenguin.id}`,
    //   littlePenguin.toJSON()
    // );
    // mockDatabase.insert(`${TheThing.collection}/${kiwi.id}`, kiwi.toJSON());
  });

  after(() => {
    mockDatabase.clear();
  });

  beforeEach(function() {
    mockDatabase.insert(`${TheThing.collection}/${kakapo.id}`, kakapo.toJSON());
  });

  it('Can change tags', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    const newTags = ['horny', 'cute', 'clumsy', 'shag camera man'];
    theThingEditorPO.expectVisible();
    theThingEditorPO.setTags(newTags);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectTags(newTags);
  });

  it('Can change name', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    const newName = '鴞鸚鵡';
    theThingEditorPO.expectVisible();
    theThingEditorPO.setName(newName);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectName(newName);
  });

  it('Can remove a cell', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    const theCell = kakapo.cells['數量'];
    theThingEditorPO.expectVisible();
    theThingEditorPO.theThingCellsEditorPO.deleteCell(theCell);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectNoCell(theCell);
  });

  it('Can remove all cells', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    theThingEditorPO.expectVisible();
    theThingEditorPO.theThingCellsEditorPO.clearAll();
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectNoCellAtAll();
  });

  it('Can add a cell', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    const newCell = TheThingCell.forge({
      name: '興趣'
    });
    theThingEditorPO.expectVisible();
    theThingEditorPO.theThingCellsEditorPO.addCell(newCell);
    theThingEditorPO.theThingCellsEditorPO.setCellValue(newCell);
    // cy.pause();
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectCell(newCell);
  });

  it('Can change any cell value', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    kakapo.cells['圖片'].value = Album.forge();
    kakapo.cells['棲地'].value = '反正不是台灣';
    kakapo.cells['習性'].value =
      '吃喝拉撒看到攝影師就上https://www.youtube.com/watch?v=9T1vfsHYiKY';
    theThingEditorPO.expectVisible();
    theThingEditorPO.theThingCellsEditorPO.updateValue(
      kakapo.getCellsByNames(['圖片', '棲地', '習性'])
    );
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectValue(kakapo);
  });
});
