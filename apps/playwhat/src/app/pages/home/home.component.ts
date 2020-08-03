import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HomepageManageService } from '@ygg/playwhat/admin';
import { ImitationPlay } from '@ygg/playwhat/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/ui';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'pw-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  exhibitThings: TheThing[] = [];
  subscriptions: Subscription[] = [];
  reloader = true;
  links: ImageThumbnailItem[] = [];
  plays$: Observable<TheThing[]>;

  constructor(
    private homepageManageService: HomepageManageService,
    private router: Router,
    private theThingAccessService: TheThingAccessService
  ) {
    const filter = ImitationPlay.filter.clone();
    filter.addState(
      ImitationPlay.stateName,
      ImitationPlay.states.forSale.value
    );
    this.plays$ = theThingAccessService.listByFilter$(filter);

    this.links.push({
      id: 'create-tour-plan',
      name: '新增一個遊程計畫',
      image: '/assets/images/tour-plan/tour-plan.png',
      path: ['/', 'tour-plans', 'create'],
      class: 'goto-create-tour-plan'
    });

    this.subscriptions.push(
      this.homepageManageService
        .loadExhibitThings$()
        .subscribe(things => (this.exhibitThings = things))
    );
    this.subscriptions.push(
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.reloader = false;
          setTimeout(() => {
            this.reloader = true;
          }, 0);
        }
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
