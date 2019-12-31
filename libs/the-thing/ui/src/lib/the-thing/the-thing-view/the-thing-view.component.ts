import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'the-thing-the-thing-view',
  templateUrl: './the-thing-view.component.html',
  styleUrls: ['./the-thing-view.component.css']
})
export class TheThingViewComponent implements OnInit, OnDestroy {
  @Input() theThing: TheThing;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.theThing) {
      if (this.route.snapshot.data && this.route.snapshot.data.theThing) {
        this.theThing = this.route.snapshot.data.theThing;
      }
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
