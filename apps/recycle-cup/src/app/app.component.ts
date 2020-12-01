import { Component } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'ygg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recycle-cup';
  subscription: Subscription = new Subscription();
  routeChange$: Subject<void> = new Subject();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onActivate() {
    this.routeChange$.next();
  }
}
