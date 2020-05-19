import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { RelationAddition } from '@ygg/shopping/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { isEmpty } from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ShoppingCartService } from '@ygg/shopping/ui';

@Component({
  selector: 'ygg-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing$: Observable<TheThing>;
  theThing: TheThing;
  subscriptions: Subscription[] = [];
  RelationAddition = RelationAddition;
  additions: TheThing[];

  constructor(
    private theThingAccessService: TheThingAccessService,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit() {
    if (!this.theThing$) {
      this.theThing$ = of(null);
    }
    this.subscriptions.push(
      this.theThing$
        .pipe(
          filter(theThing => !!theThing),
          tap(theThing => (this.theThing = theThing)),
          switchMap(theThing => {
            if (theThing && theThing.hasRelation(RelationAddition.name)) {
              return this.theThingAccessService.listByIds$(
                this.theThing.getRelationObjectIds(RelationAddition.name)
              );
            } else {
              return of([]);
            }
          }),
          tap(additions => {
            this.additions = isEmpty(additions) ? undefined : additions;
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subcsription of this.subscriptions) {
      subcsription.unsubscribe();
    }
  }

  purchase() {
    this.cartService.add(this.theThing);
  }
}
