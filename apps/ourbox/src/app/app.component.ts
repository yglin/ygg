import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ourbox';
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
