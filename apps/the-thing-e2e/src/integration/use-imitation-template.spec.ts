import { kakapo, kiwi, littlePenguin } from './australia-birbs';
import { Frodo, Sam, Gollum } from './hobbits';
import { MockDatabase } from '@ygg/shared/test/cypress';
import {
  TheThing,
  TheThingImitation,
  ImitationsDataPath
} from '@ygg/the-thing/core';
import {
  ImitationManagerPageObjectCypress,
  TheThingEditorPageObjectCypress,
  TheThingViewPageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationEditorPageObject } from '@ygg/the-thing/ui';

const mockDatabase = new MockDatabase();

describe('Use imitation to create the-thing', () => {
  const gayHobbit = new TheThingImitation(Sam, {
    name: 'Gay Hobbit',
    description:
      'Fucking gay hobbit like Samwise Gamgee but eventually get married to some dumb ass girl in his village'
  });

  const australianBirb = new TheThingImitation(kakapo, {
    id: 'australian-birb',
    name: 'Australian Birb',
    description: '澳洲的鳥鳥'
  });

  before(() => {
    mockDatabase.backupRTDB(ImitationsDataPath);

    // Add kakapo into mock-database
    mockDatabase.insert(`${TheThing.collection}/${kakapo.id}`, kakapo.toJSON());

    // Add Sam into mock-database
    mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());

    // Add Sam as Imitation Gay Hobbit into mock-database
    mockDatabase.insertRTDB(
      `${ImitationsDataPath}/${gayHobbit.id}`,
      gayHobbit
    );
    cy.visit('/');
  });

  after(() => {
    mockDatabase.clear();
    mockDatabase.restoreRTDB(ImitationsDataPath);
  });

  it('In imitation management page, add a the-thing and set it as imitation', () => {
    // ===== Go to admin page for imitations managements
    cy.visit('/the-things/imitations');
    const theThingImitationManagePO = new ImitationManagerPageObjectCypress();
    theThingImitationManagePO.expectVisible();

    // ===== Add kakapo as new imitation Australian Birb
    theThingImitationManagePO.addImitation(australianBirb, kakapo);

    // ===== Go to the-thing editor
    cy.visit('/the-things/create');
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();

    // ===== Expect Australian Birb as option in imitation select
    theThingEditorPO.expectImitaion(australianBirb);
  });

  it('In editor, select an imitation and apply it', () => {
    // ===== GO to /the-things/create
    cy.visit('/the-things/create');
    const theThingEditorPO = new TheThingEditorPageObjectCypress();
    theThingEditorPO.expectVisible();

    // ===== Select imitation Gay Hobbit and apply it
    theThingEditorPO.applyImitation(gayHobbit);

    // ===== Submit and auto redircet to view
    theThingEditorPO.submit();
    const theThingViewPO = new TheThingViewPageObjectCypress();
    theThingViewPO.expectVisible();

    // ===== Expect data of template of Gay Hobbit, aka. Sam
    theThingViewPO.expectValue(Sam);
  });
});
