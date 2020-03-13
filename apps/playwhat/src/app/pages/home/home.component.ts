import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { HomepageManageService } from '@ygg/playwhat/admin';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'pw-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  exhibitThings: TheThing[] = [];
  subscriptions: Subscription[] = [];
  reloader = true;

  constructor(private homepageManageService: HomepageManageService, private router: Router) {
    this.subscriptions.push(
      this.homepageManageService
        .loadExhibitThings$()
        .subscribe(things => (this.exhibitThings = things))
    );
    this.subscriptions.push(this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.reloader = false;
        setTimeout(() => {
          this.reloader = true;
        }, 0);
      }
    }))
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
