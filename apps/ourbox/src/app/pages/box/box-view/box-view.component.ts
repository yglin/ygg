import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImitationItem } from '@ygg/ourbox/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { NotificationFactoryService } from '@ygg/shared/user/ui';
import { TheThing } from '@ygg/the-thing/core';
import { get, isEmpty, range } from 'lodash';
import { Observable, Subscription, merge } from 'rxjs';
import { BoxFactoryService } from '../../../box-factory.service';
import { tap } from 'rxjs/operators';
import { User } from '@ygg/shared/user/core';

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
  itemsInEditing: TheThing[] = [];
  subscriptions: Subscription[] = [];
  ImitationItem = ImitationItem;
  isBoxEmpty = true;
  members: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boxFactory: BoxFactoryService,
    private notificationFactory: NotificationFactoryService,
    private dialog: YggDialogService
  ) {
    this.box = get(this.route.snapshot.data, 'box', null);
    if (this.box) {
      // console.log(this.box);
      const items$: Observable<any> = this.boxFactory
        .listItemsAvailableInBox$(this.box.id)
        .pipe(tap(items => (this.items = isEmpty(items) ? [] : items)));
      const itemsInEditing$: Observable<any> = this.boxFactory
        .listMyItemsEditingInBox$(this.box.id)
        .pipe(
          tap(items => (this.itemsInEditing = isEmpty(items) ? [] : items))
        );
      const members$: Observable<User[]> = this.boxFactory
        .listMembers$(this.box.id)
        .pipe(tap(members => (this.members = members)));

      this.subscriptions.push(
        merge(items$, itemsInEditing$, members$)
          .pipe(
            tap(() => {
              this.isBoxEmpty =
                isEmpty(this.items) && isEmpty(this.itemsInEditing);
            })
          )
          .subscribe()
      );
    }
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
    const emails = await this.notificationFactory.inquireEmails();
    // console.log(emails);
    if (!isEmpty(emails)) {
      this.boxFactory.inviteBoxMembers(this.box, emails);
    }
  }
}
