import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { range, get, isEmpty } from 'lodash';
import { BoxAccessService } from '../../../box-access.service';
import { ItemAccessService } from '../../../item-access.service';
import { ItemFactoryService } from '../../../item-factory.service';
import { BoxFactoryService } from '../../../box-factory.service';
import { ImitationItem } from '@ygg/ourbox/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { InvitationFactoryService } from '@ygg/shared/user/ui';

function forgeItems(): TheThing[] {
  return range(10).map(() => {
    const item = TheThing.forge();
    item.link = `items/${item.id}`;
    return item;
  });
}

@Component({
  selector: 'ygg-box-view',
  templateUrl: './box-view.component.html',
  styleUrls: ['./box-view.component.css']
})
export class BoxViewComponent implements OnInit, OnDestroy {
  box: TheThing;
  items: TheThing[] = [];
  subscriptions: Subscription[] = [];
  ImitationItem = ImitationItem;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boxFactory: BoxFactoryService,
    private invitationFactory: InvitationFactoryService,
    private dialog: YggDialogService
  ) {
    this.box = get(this.route.snapshot.data, 'box', null);
    // console.log(this.box);
    this.subscriptions.push(
      this.boxFactory
        .listItemsInBox$(this.box.id)
        .subscribe(items => (this.items = items))
    );
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  createItem() {
    this.boxFactory.createItem(this.box.id, { backUrl: this.router.url });
  }

  async inviteMember() {
    const emails = await this.invitationFactory.inquireEmails();
    // console.log(emails);
    if (!isEmpty(emails)) {
      this.boxFactory.inviteBoxMembers(this.box, emails);
    }
  }
}
