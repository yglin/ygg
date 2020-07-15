Cypress.Commands.add(
  'dragTo',
  { prevSubject: 'element' },
  (subject, droppableSelector: string) => {
    const coords = Cypress.$(droppableSelector)[0].getBoundingClientRect();
    cy.wrap(subject)
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: coords.x + 10, clientY: coords.y + 10 })
      .trigger('mouseup', { force: true });
  }
);
