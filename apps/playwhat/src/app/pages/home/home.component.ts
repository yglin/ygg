import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { HomepageManageService } from '@ygg/playwhat/admin';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { ImitationTourPlan, ImitationPlay } from '@ygg/playwhat/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

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
