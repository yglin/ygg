import { TheThingCell, TheThingCellTypes } from "@ygg/the-thing/core";

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
  const theThing: any = {
    types: ['play', 'lesson', 'travel', 'food'],
    name: 'The Thing 1982',
    cells: [
      {
        name: 'title',
        type: 'text',
        value: 'John Carpenter\'s The Thing'
      },
      {
        name: 'introduction',
        type: 'longtext',
        value:
          'A US research station, Antarctica, early-winter 1982. The base is suddenly buzzed by a helicopter from the nearby Norwegian research station. They are trying to kill a dog that has escaped from their base. After the destruction of the Norwegian chopper the members of the US team fly to the Norwegian base, only to discover them all dead or missing. They do find the remains of a strange creature the Norwegians burned. The Americans take it to their base and deduce that it is an alien life form. After a while it is apparent that the alien can take over and assimilate into other life forms, including humans, and can spread like a virus. This means that anyone at the base could be inhabited by The Thing, and tensions escalate.'
      }
    ]
  };

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
    cy.wrap(theThing.cells).each((cell: any) =>
      addCell(cell)
    );

    // Submit
    cy.get('button.submit').click();

    // Wait for navigating to view page
    cy.location({ timeout: 10000 }).should('not.match', /.*\/the-things\/create/);

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
  });
});
