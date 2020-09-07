import { Injectable, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SideMenu, Page } from '@ygg/shared/ui/core';
import { ReplaySubject, BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SideDrawerService implements OnDestroy {
  sideDrawer: MatDrawer;
  sideMenu: SideMenu = {
    links: {}
  };
  sideMenu$: BehaviorSubject<SideMenu> = new BehaviorSubject(this.sideMenu);
  subscription: Subscription = new Subscription();

  constructor(private router: Router) {
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
