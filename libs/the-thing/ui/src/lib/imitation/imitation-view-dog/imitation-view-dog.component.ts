import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  TheThing,
  TheThingValidateError,
  ImitationDog
} from '@ygg/the-thing/core';
import { TheThingImitationViewInterface } from '../../the-thing';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'the-thing-imitation-view-dog',
  templateUrl: './imitation-view-dog.component.html',
  styleUrls: ['./imitation-view-dog.component.css']
})
export class ImitationViewDogComponent
  implements OnInit, OnDestroy, TheThingImitationViewInterface {
  @Input() theThing$: Observable<TheThing>;
  theThing: TheThing;
  validateErrors: TheThingValidateError[] = [];
  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    if (this.theThing$) {
      this.subscriptions.push(
        this.theThing$
          .pipe(
            filter(theThing => !!theThing),
            tap(theThing => (this.theThing = theThing)),
            tap(
              theThing =>
                (this.validateErrors = ImitationDog.validate(this.theThing))
            )
          )
          .subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
