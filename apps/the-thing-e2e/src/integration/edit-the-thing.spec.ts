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
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
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
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
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
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.deleteCell(theCell);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectNoCell(theCell);
  });

  it('Can remove all cells', () => {
    cy.visit(`the-things/${kakapo.id}/edit`);
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.deleteAllCells();
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
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.addCell(newCell);
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
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();
    theThingEditorPO.setCell(kakapo.cells['圖片']);
    theThingEditorPO.setCell(kakapo.cells['棲地']);
    theThingEditorPO.setCell(kakapo.cells['習性']);
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();
    theThingViewPO.expectValue(kakapo);
  });
});

