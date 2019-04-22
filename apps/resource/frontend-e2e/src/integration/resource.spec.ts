import {checkAlbum, checkContact, checkLocation, fillUpAlbum, fillUpContact, fillUpLocation, navigateToMyResources} from '../support/app.po';

describe('Create, Update, Delete Resource', () => {
  beforeEach(() => {
    navigateToMyResources();
    cy.fixture('example-resource.json').as('exampleResource');
  });

  it('should create a resource and show correct data', () => {
    cy.get('button#add-resource').click();
    cy.get('input#name').type(this.exampleResource.name);
    cy.get('textarea#description').type(this.exampleResource.description);
    cy.get('button#next-step').click();

    fillUpAlbum(this.exampleResource.album);
    cy.get('button#next-step').click();

    fillUpContact(this.exampleResource.contact);
    cy.get('button#next-step').click();

    fillUpLocation(this.exampleResource.location);
    cy.get('button#submit').click();

    cy.wait(5000);

    cy.get('div#resource-01').click();

    cy.get('h5#name').contains(this.exampleResource.name);
    cy.get('pre#description').contains(this.exampleResource.description);
    checkAlbum(this.exampleResource.album);
    checkContact(this.exampleResource.contact);
    checkLocation(this.exampleResource.location);
  });
});
