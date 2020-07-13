import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import {
  AuthenticateService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { Observable, isObservable, Subscription, of, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ImitationItem, ImitationItemTransfer } from '@ygg/ourbox/core';
import { ItemFactoryService } from '../../../item-factory.service';
import { tap, switchMap, map } from 'rxjs/operators';
import { User } from '@ygg/shared/user/core';
import { ItemTransferFactoryService } from '../../../item-transfer-factory.service';

@Component({
  selector: 'ygg-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit, OnDestroy {
  @Input() item$: Observable<TheThing>;
  item: TheThing;
  holderId$: Observable<string>;
  standbyList: string[] = [];
  subscriptions: Subscription[] = [];
  ImitationItem = ImitationItem;
  amHolder = false;
  hasRequested = false;

  constructor(
    private route: ActivatedRoute,
    private authUiService: AuthenticateUiService,
    private itemFactory: ItemFactoryService,
    private itemTransferFactory: ItemTransferFactoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.item$) {
      this.item$ = this.route.snapshot.data.item$;
      // console.log(`Got item$ in route.snapshot.data`);
      // console.dir(this.item$);
    }
    if (isObservable(this.item$)) {
      const itemUpdate$ = this.item$.pipe(tap(item => (this.item = item)));

      this.holderId$ = itemUpdate$.pipe(
        switchMap(item => {
          return this.itemFactory.getItemHolder$(item.id);
        }),
        map((holder: User) => holder.id)
      );

      const borrowers$ = itemUpdate$.pipe(
        switchMap(item => {
          if (item) {
            return this.itemFactory.getItemRequestBorrowers$(item.id);
          } else {
            return of([]);
          }
        }),
        tap(
          (requestBorrorers: User[]) =>
            (this.standbyList = requestBorrorers.map(rb => rb.id))
        )
      );

      const amHolder$ = itemUpdate$.pipe(
        switchMap(item => {
          return this.itemFactory.isItemHolder$(item.id);
        }),
        tap((amHolder: boolean) => (this.amHolder = amHolder))
      );

      const hasRequested$ = itemUpdate$.pipe(
        switchMap(item => this.itemFactory.hasRequestedBorrowItem$(item.id)),
        tap(hasRequested => (this.hasRequested = hasRequested))
        // tap(hasRequested => console.log(`has requested: ${hasRequested}`))
      );

      this.subscriptions.push(
        merge(itemUpdate$, borrowers$, amHolder$, hasRequested$).subscribe()
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async askForIt() {
    this.itemFactory.requestBorrowItem(this.item.id);
  }

  isMe(userId: string): boolean {
    return this.authUiService.isMe(userId);
  }

  cancelRequest() {
    this.itemFactory.cancelRequest(this.item.id);
  }

  giveToNext() {
    this.itemTransferFactory.giveAway(this.item.id);
  }

  async gotoTransfer() {
    const itemTransfer: TheThing = await this.itemTransferFactory.getLatestItemTransfer(
      this.item
    );
    this.router.navigate([
      '/',
      ImitationItemTransfer.routePath,
      itemTransfer.id
    ]);
  }
}
