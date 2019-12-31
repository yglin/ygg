import { last } from 'lodash';
import { TheThingCell, TheThing } from '@ygg/the-thing/core';
import { login, MockDatabase } from '@ygg/shared/test/cypress';

function setValueText(value: string) {
  cy.get('.last-cell input')
    .clear()
    .type(value);
}

function setValueLongtext(value: string) {
  cy.get('.last-cell textarea')
    .clear()
    .type(value);
}

function addCell(cell: TheThingCell) {
  cy.get('.add-cell .name input')
    .clear()
    .type(cell.name);
  cy.get('.add-cell .types select').select(cell.type);
  cy.get('.add-cell button').click();
  switch (cell.type) {
    case 'text':
      setValueText(cell.value);
      break;
    case 'longtext':
      setValueLongtext(cell.value);
      break;
    default:
      break;
  }
}

function expectCellText(cell: TheThingCell) {
  cy.get(`.cell[cell-name="${cell.name}"]`).contains(cell.value);
}

const expectCelllongtext = expectCellText;

function expectCell(cell: TheThingCell) {
  switch (cell.type) {
    case 'text':
      expectCellText(cell);
      break;

    case 'longtext':
      expectCelllongtext(cell);
      break;

    default:
      break;
  }
}

describe('Create a new the-thing', () => {
  const mockDatabase = new MockDatabase();
  const theThing: TheThing = TheThing.forge({
    cells: [
      TheThingCell.forge({ type: 'text' }),
      TheThingCell.forge({ type: 'longtext' })
    ]
  });

  before(function() {
    login();
  });

  it('Create a new the-thing, confirm data consistency', () => {
    // Navigate to the-thing creation page
    cy.visit('/the-things/create');

    // Choose type tags of the-thing
    cy.wrap(theThing.types).each((type: string) => {
      cy.get('.meta .types input')
        .clear()
        .type(type);
      cy.get('.types button.add').click();
    });

    // Input name of the thing
    cy.get('.meta .name input')
      .clear()
      .type(theThing.name);

    // Add cells
    cy.wrap(theThing.cells).each((cell: any) => addCell(cell));

    // Submit
    cy.get('button.submit').click();

    // Wait for navigating to view page
    cy.location({ timeout: 10000 }).should(
      'not.match',
      /.*\/the-things\/create/
    );
    cy.location('pathname').then((pathname: any) => {
      const id = last((pathname as string).split('/'));

      // Expect types
      cy.wrap(theThing.types).each((type: string) => {
        cy.get('.types').contains(type);
      });

      // Expect name
      cy.get('.name').contains(theThing.name);

      // Expect cells
      cy.wrap(theThing.cells).each((cell: any) => {
        expectCell(cell);
      });

      // clear data
      mockDatabase.delete(`${theThing.collection}/${id}`);
    });
  });
});
