import { loginAnonymously } from '@ygg/e2e/user/frontend';

export function navigateToMyResources() {
  cy.visit('/');
  loginAnonymously();
  cy.get('div#account-widget').click();
  cy.get('div#user-menu').get('button#resources').click();
}

export function fillUpAlbum(album) {
  for (const photoUrl of album.photos) {
    cy.get('input#photo-url').type(photoUrl);
    cy.get('button#add-photo').click();
  }
  cy.get(`div#photos img[src="${album.cover}"]`).click();
}

export function checkAlbum(album) {
  for (const photoUrl of album.photos) {
    cy.get(`div#photos img[src="${photoUrl}"]`).should('be.visible');
  }
  cy.get(`div#cover-photo img[src="${album.cover}"]`).should('be.visible');
}

export function fillUpContact(contact) {
  cy.get('input#name').type(contact.name);
  cy.get('input#email').type(contact.email);
  cy.get('input#phone').type(contact.phone);
  cy.get('input#lineID').type(contact.lineID);
}

export function checkContact(contact) {
  cy.get('div#name').contains(contact.name);
  cy.get('div#email').contains(contact.email);
  cy.get('div#phone').contains(contact.phone);
  cy.get('div#lineID').contains(contact.lineID);
}

export function fillUpLocation(location) {
  cy.get('select#county').type(location.county);
  cy.wait(2000);
  cy.get('select#city').type(location.city);
  cy.get('input#address').type(location.address);
}

export function checkLocation(location) {
  if (location.country) {
    cy.get('div#location').contains(location.country);
  }
  if (location.county) {
    cy.get('div#location').contains(location.county);
  }
  if (location.city) {
    cy.get('div#location').contains(location.city);
  }
  if (location.district) {
    cy.get('div#location').contains(location.district);
  }
  cy.get('div#location').contains(location.address);
}
