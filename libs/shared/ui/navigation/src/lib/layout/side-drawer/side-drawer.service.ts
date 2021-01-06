import { Injectable, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SideMenu, Page, Action } from '@ygg/shared/ui/core';
import { ReplaySubject, BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActionBeaconService } from '../../action-beacon.service';

@Injectable({
  providedIn: 'root'
})
export class SideDrawerService implements OnDestroy {
  sideDrawer: MatDrawer;
  sideMenu: SideMenu = {
    links: {},
    actions: {}
  };
  sideMenu$: BehaviorSubject<SideMenu> = new BehaviorSubject(this.sideMenu);
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private actionBeacon: ActionBeaconService
  ) {
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.close();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addPageLink(page: Page) {
    this.sideMenu.links[page.id] = page;
    this.sideMenu$.next(this.sideMenu);
  }

  addAction(action: Action) {
    this.sideMenu.actions[action.id] = action;
    this.actionBeacon.register(action);
    this.sideMenu$.next(this.sideMenu);
  }

  setSideDrawer(drawer: MatDrawer) {
    if (!!drawer) {
      this.sideDrawer = drawer;
    }
  }

  open() {
    if (this.sideDrawer) {
      this.sideDrawer.open();
    }
  }

  close() {
    if (this.sideDrawer) {
      this.sideDrawer.close();
    }
  }
}
