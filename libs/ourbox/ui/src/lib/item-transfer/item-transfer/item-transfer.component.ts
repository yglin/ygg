import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ActivatedRoute } from '@angular/router';
import { get, first } from 'lodash';
import { isObservable, Observable, Subscription, merge, interval } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import {
  ImitationItemTransfer,
  RelationshipItemTransferGiver,
  RelationshipItemTransferReceiver,
  RelationshipItemTransferItem
} from '@ygg/ourbox/core';
import { ItemTransferFactoryService } from '../item-transfer-factory.service';
import { EmceeService } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'ourbox-item-transfer',
  templateUrl: './item-transfer.component.html',
  styleUrls: ['./item-transfer.component.css']
})
export class ItemTransferComponent implements OnInit, OnDestroy {
  itemTransfer$: Observable<TheThing>;
  itemTransfer: TheThing;
  subscriptions: Subscription[] = [];
  ImitationItemTransfer = ImitationItemTransfer;
  showThread = true;
  giverId: string;
  receiverId: string;
  itemId: string;
  runningStep = 0;
  stopRunner = false;

  constructor(
    private route: ActivatedRoute,
    private itemTransferFactory: ItemTransferFactoryService,
    private emcee: EmceeService
  ) {}

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.itemTransfer$ = get(this.route.snapshot.data, 'itemTransfer$', null);
    if (isObservable(this.itemTransfer$)) {
      const itemTransferUpdate$ = this.itemTransfer$.pipe(
        tap(itemTransfer => {
          this.itemTransfer = itemTransfer;
          this.giverId = first(
            this.itemTransfer.listUserIdsOfRole(
              RelationshipItemTransferGiver.role
            )
          );
          this.receiverId = first(
            this.itemTransfer.listUserIdsOfRole(
              RelationshipItemTransferReceiver.role
            )
          );
          this.itemId = first(
            this.itemTransfer.getRelationObjectIds(
              RelationshipItemTransferItem.name
            )
          );
          this.showThread = !ImitationItemTransfer.isInStates(itemTransfer, [
            ImitationItemTransfer.states.new
          ]);
        })
      );
      // const giverId$: Observable<any> = itemTransferUpdate$.pipe(
      //   switchMap(itemTransfer =>
      //     this.itemTransferFactory.getGiver(itemTransfer.id)
      //   ),
      //   tap(giver => (this.giverId = giver ? giver.id : null))
      // );
      // const receiverId$: Observable<any> = itemTransferUpdate$.pipe(
      //   switchMap(itemTransfer =>
      //     this.itemTransferFactory.getReceiver(itemTransfer.id)
      //   ),
      //   tap(receiver => (this.receiverId = receiver ? receiver.id : null))
      // );
      // const itemId$: Observable<any> = itemTransferUpdate$.pipe(
      //   switchMap(itemTransfer =>
      //     this.itemTransferFactory.getTransferItem(itemTransfer.id)
      //   ),
      //   tap(item => (this.itemId = item ? item.id : null))
      // );

      this.subscriptions.push(itemTransferUpdate$.subscribe());

      // Animate running step
      this.subscriptions.push(
        interval(500)
          .pipe(
            tap(() => {
              if (!this.stopRunner) {
                this.runningStep = (this.runningStep + 1) % 3;
              }
            })
          )
          .subscribe()
      );
    } else {
      this.emcee.error(`找不到交付任務`);
    }
  }
}
