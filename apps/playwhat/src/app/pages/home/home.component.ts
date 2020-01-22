import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { HomepageManageService } from '@ygg/playwhat/admin';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pw-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  exhibitThings: TheThing[] = [];
  subscriptions: Subscription[] = [];

  constructor(private homepageManageService: HomepageManageService) {
    this.subscriptions.push(
      this.homepageManageService
        .loadExhibitThings$()
        .subscribe(things => (this.exhibitThings = things))
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
