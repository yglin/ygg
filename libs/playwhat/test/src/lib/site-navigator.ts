import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { timeout } from 'rxjs/operators';
import { ImitationEvent } from '@ygg/playwhat/core';

const expectPageTrivial = () => cy.get('body').should('be.visible');

export class SiteNavigator {
  goto(
    path: string[] = ['home'],
    targetPage?: PageObjectCypress
  ): Cypress.Chainable<any> {
    if (!targetPage) {
      targetPage = new PageObjectCypress('body');
    }
    const fullPathName = `/${path.join('/')}`;
    cy.log(`Go to ${fullPathName}`);
    this.gotoHome();
    const route = path.shift();
    if (route === 'plays') {
      this.gotoPlays(path);
    } else if (route === 'admin') {
      this.gotoAdmin(path);
    } else if (route === 'scheduler') {
      if (path[0] === 'schedule-plans' && path[1] === 'new') {
        cy.get('a#new-schedule').click({ force: true });
      } else {
        this.gotoScheduler(path);
      }
    } else if (route === 'the-things') {
      this.gotoTheThings(path);
    } else if (route === 'tour-plans') {
      this.gotoTourPlans(path);
    } else if (route === 'shopping') {
      this.gotoShopping(path);
    } else if (route === ImitationEvent.routePath) {
      this.gotoEvents(path);
    }
    return targetPage.expectVisible();
  }

  private gotoHome() {
    cy.get('.pw-header #to-home').click({ force: true });
    cy.location('pathname').should('eq', '/home');
  }
  // gotoSchedulePlanView(schedulePlan: SchedulePlan) {
  //   cy.visit(`/scheduler/schedule-plans/${schedulePlan.id}`);
  // }

  private gotoTourPlans(path: string[] = []) {
    const route = path.shift();
    if (route === 'create') {
      cy.get('.pw-header .tour-plan-create').click({ force: true });
    } else if (route === 'my') {
      cy.get('.account-widget .menu-trigger').click({ force: true });
      cy.get('.user-menu-item button#tour-plan').click({ force: true });
    } else {
      throw new Error(`Unsupported route for tour-plans: ${route}`);
    }
  }

  private gotoTheThings(path: string[] = []) {
    const route = path.shift();
    if (route === 'my') {
      cy.get('.account-widget .menu-trigger', { timeout: 10000 }).click({
        force: true
      });
      cy.get('.user-menu-item button#my-things').click({ force: true });
    }
  }

  private gotoPlays(path: string[] = []) {
    const route = path.shift();
    if (route === 'new') {
      cy.get('a#add-my-play').click({ force: true });
    } else if (route === 'my') {
      this.gotoMyPlay(path);
    }
  }

  private gotoMyPlay(path: string[]) {
    cy.get('.account-widget .menu-trigger').click({ force: true });
    cy.get('.user-menu-item button#play').click({ force: true });
    // const route = path.shift();
    // if (route === 'list') {
    //   cy.get('#play-list').click({ force: true });
    // }
  }

  private gotoScheduler(path: string[]) {
    const route = path.shift();
    if (route === 'schedule-plans') {
      this.gotoSchedulePlans(path);
    }
  }

  private gotoShopping(path: string[]) {
    const route = path.shift();
    if (route === 'cart') {
      cy.get('.pw-header .shopping-cart-button button').click();
    }
  }

  private gotoEvents(path: string[]) {
    const route = path.shift();
    if (route === 'my') {
      cy.get('.account-widget .menu-trigger', { timeout: 10000 }).click({
        force: true
      });
      cy.get('.user-menu-item button#my-events').click({ force: true });
    }
  }

  private gotoAdmin(path: string[] = []) {
    cy.get('.account-widget .menu-trigger', { timeout: 10000 }).click({
      force: true
    });
    cy.get('.user-menu-item button#admin').click({ force: true });
    const route = path.shift();
    if (route === 'play') {
      cy.get('#plays').click();
    } else if (route === 'tags') {
      this.gotoAdminTags(path);
    } else if (route === 'scheduler') {
      this.gotoAdminScheduler(path);
    } else if (route === 'tour-plans') {
      cy.get('#tour-plans').click();
    } else if (route === 'tour-plan-applications') {
      cy.get('#tour-plan-applications').click();
    } else if (route === 'homepage') {
      cy.get('#homepage-manage a').click({ force: true });
    }
  }

  private gotoAdminScheduler(path: string[]) {
    cy.get('#scheduler').click({ force: true });
    const route = path.shift();
    if (route === 'staff') {
      this.gotoAdminSchedulerStaff(path);
    }
  }

  private gotoAdminSchedulerStaff(path: string[]) {
    cy.get('#staff').click({ force: true });
    const route = path.shift();
    if (route === 'agent') {
      cy.get('#agent').click({ force: true });
    }
  }

  private gotoAdminPlay(path: string[] = []) {
    cy.get('#play').click({ force: true });
    const route = path.shift();
    if (route === 'tags') {
      cy.get('#tags').click({ force: true });
    }
  }

  private gotoAdminTags(path: string[] = []) {
    cy.get('#tags a').click({ force: true });
    const route = path.shift();
    if (route === 'list') {
      cy.get('#list a').click({ force: true });
    }
  }

  private gotoSchedulePlans(path: string[] = []) {
    const route = path.shift();
    if (route === 'my') {
      cy.get('.account-widget .menu-trigger').click({ force: true });
      cy.get('.user-menu-item button#scheduler').click({ force: true });
      cy.get('.my-schedule-plan-list').click({ force: true });
    }
  }
}
