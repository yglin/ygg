enum TheThingCellType {
  text = 'text',
  longtext = 'longtext'
}

interface TheThingCell {
  name: string;
  type: string;
  value: any;
}

function setValueText(value: string) {
  cy.get('.new-cell .value input')
    .clear()
    .type(value);
}

function setValueLongtext(value: string) {
  cy.get('.new-cell .value textarea')
    .clear()
    .type(value);
}

function addCell(cell: TheThingCell) {
  cy.get('.new-cell .name input')
    .clear()
    .type(cell.name);
  cy.get('.new-cell .type-select').select(cell.type);
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
  cy.get('button.add-cell').click();
}

function expectCellText(cell: TheThingCell) {
  cy.get(`.cell[name="${cell.name}"] .value`).contains(cell.value);
}

const expectCelllongtext = expectCellText;

function expectCell(cell: TheThingCell) {
  switch (cell.type) {
    case TheThingCellType.text:
      expectCellText(cell);
      break;

    case TheThingCellType.longtext:
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
    cy.visit('/the-thing/create');

    // Choose type tags of the-thing
    cy.wrap(theThing.types).each((type: string) => {
      cy.get('.types input')
        .clear()
        .type(type);
      cy.get('.types button.add').click();
    });

    // Input name of the thing
    cy.get('.name input')
      .clear()
      .type(theThing.name);

    // Add cells
    cy.wrap(theThing.cells).each((cell: any) =>
      addCell(cell)
    );

    // Submit
    cy.get('button.submit').click();

    // Wait for navigating to view page
    cy.location({ timeout: 10000 }).should('match', /.*\/the-thing\/.+/);

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
