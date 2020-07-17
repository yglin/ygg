Cypress.Commands.add(
  'dragTo',
  { prevSubject: 'element' },
  (subject, droppableSelector: string) => {
    const coords = Cypress.$(droppableSelector)[0].getBoundingClientRect();
    cy.wrap(subject)
      .trigger('mousedown', 10, 5, { button: 0, force: true })
      .trigger('mousemove', {
        clientX: coords.x + 1,
        clientY: coords.y + 1,
        force: true
      })
      .trigger('mouseup', { force: true });
  }
);
