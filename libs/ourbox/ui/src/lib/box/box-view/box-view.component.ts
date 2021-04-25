import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Box, Treasure } from '@ygg/ourbox/core';
import { TheThing } from '@ygg/the-thing/core';
import { get, range } from 'lodash';
import { Subscription } from 'rxjs';
import { HeadQuarterService } from '../../head-quarter.service';
import { BoxFinderService } from '../box-finder.service';

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
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boxFinder: BoxFinderService,
    private headquarter: HeadQuarterService
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
      this.subscription.add(
        this.headquarter.subscribe('treasure.addToBox.success', data => {
          if (data.box && data.box.id === this.box.id) {
            this.loadTreasures();
          }
        })
      );
    }
  }

  ngOnDestroy() {
    // for (const subscription of this.subscriptions) {
    //   subscription.unsubscribe();
    // }
    this.subscription.unsubscribe();
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

  showOnMap() {
    this.headquarter.emit('box.showOnMap', this.box);
  }
}
