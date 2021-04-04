import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page } from '@ygg/shared/ui/core';
import { values } from 'lodash';
import { Subscription } from 'rxjs';
import { SideDrawerService } from './side-drawer.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css']
})
export class SideDrawerComponent implements OnInit, OnDestroy {
  pageLinks: Page[] = [];
  subscription: Subscription = new Subscription();

  constructor(private sideDrawer: SideDrawerService) {
    this.subscription.add(
      this.sideDrawer.sideMenu$.subscribe(sideMenu => {
        this.pageLinks = values(sideMenu.links);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}

  onClickPageLink(page: Page) {
    this.sideDrawer.clickOnPage(page.id);
  }
}
