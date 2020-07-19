import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ActivatedRoute } from '@angular/router';
import { get } from 'lodash';
import { isObservable, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ImitationItemTransfer } from '@ygg/ourbox/core';

@Component({
  selector: 'ygg-item-transfer',
  templateUrl: './item-transfer.component.html',
  styleUrls: ['./item-transfer.component.css']
})
export class ItemTransferComponent implements OnInit, OnDestroy {
  itemTransfer$: Observable<TheThing>;
  itemTransfer: TheThing;
  subscriptions: Subscription[] = [];
  ImitationItemTransfer = ImitationItemTransfer;
  showThread = true;

  constructor(private route: ActivatedRoute) {
    this.itemTransfer$ = get(this.route.snapshot.data, 'itemTransfer$', null);
    if (isObservable(this.itemTransfer$)) {
      const itemTransferUpdate$ = this.itemTransfer$.pipe(
        tap(itemTransfer => {
          this.itemTransfer = itemTransfer;
        })
      );
      this.subscriptions.push(itemTransferUpdate$.subscribe());
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnInit(): void {}
}
