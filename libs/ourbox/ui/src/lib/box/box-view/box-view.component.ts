import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ImitationItem, ImitationBox } from '@ygg/ourbox/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { NotificationFactoryService } from '@ygg/shared/user/ui';
import { TheThing, TheThingDisplay } from '@ygg/the-thing/core';
import { get, isEmpty, range } from 'lodash';
import { Observable, Subscription, merge } from 'rxjs';
import { BoxFactoryService } from '../box-factory.service';
import { tap } from 'rxjs/operators';
import { User } from '@ygg/shared/user/core';
import { BoxFinderService } from '../box-finder.service';
import { Box, Treasure } from '@ygg/ourbox/core';

function forgeItems(): TheThing[] {
  return range(10).map(() => {
    const treasure = TheThing.forge();
    treasure.link = `treasures/${treasure.id}`;
    return treasure;
  });
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-box-view',
  templateUrl: './box-view.component.html',
  styleUrls: ['./box-view.component.css']
})
export class BoxViewComponent implements OnInit, OnDestroy {
  box: Box;
  treasures: Treasure[] = [];
  isBoxEmpty = true;
  pageIcon = Box.icon;
  // members: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boxFinder: BoxFinderService
  ) {}

  async loadTreasures() {
    this.treasures = await this.boxFinder.findTreasuresInBox(this.box);
    // console.dir(this.treasures);
  }

  ngOnInit(): void {
    this.box = get(this.route.snapshot.data, 'box', null);
    // console.dir(this.box);
    if (!!this.box) {
      this.loadTreasures();
    }
  }

  ngOnDestroy() {
    // for (const subscription of this.subscriptions) {
    //   subscription.unsubscribe();
    // }
  }

  createItem() {
    // this.boxFactory.createItem(this.box.id, { backUrl: this.router.url });
  }

  async inviteMember() {
    // const emails = await this.notificationFactory.inquireEmails();
    // // console.log(emails);
    // if (!isEmpty(emails)) {
    //   this.boxFactory.inviteBoxMembers(this.box, emails);
    // }
  }

  gotoTreasure(treasure: Treasure) {
    this.router.navigate(['/', 'treasure', treasure.id]);
  }
}
