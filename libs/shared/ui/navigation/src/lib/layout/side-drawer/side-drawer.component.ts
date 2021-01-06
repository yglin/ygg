import { Component, OnInit, OnDestroy } from '@angular/core';
import { SideDrawerService } from './side-drawer.service';
import { Page, Action } from '@ygg/shared/ui/core';
import { values } from 'lodash';
import { Subscription } from 'rxjs';
import { ActionBeaconService } from '../../action-beacon.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-side-drawer',
  templateUrl: './side-drawer.component.html',
  styleUrls: ['./side-drawer.component.css']
})
export class SideDrawerComponent implements OnInit, OnDestroy {
  pageLinks: Page[] = [];
  actions: Action[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private sideDrawer: SideDrawerService,
    private actionBeacon: ActionBeaconService
  ) {
    this.subscription.add(
      this.sideDrawer.sideMenu$.subscribe(sideMenu => {
        this.pageLinks = values(sideMenu.links);
        this.actions = values(sideMenu.actions);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}

  onClickPageLink() {
    this.sideDrawer.close();
  }

  onClickAction(action: Action) {
    this.actionBeacon.run(action.id);
  }
}
