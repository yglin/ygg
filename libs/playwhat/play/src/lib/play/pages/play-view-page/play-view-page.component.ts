import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Play } from '../..';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout, first } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { AuthenticateService, User } from "@ygg/shared/user/ui";

@Component({
  selector: 'ygg-play-view-page',
  templateUrl: './play-view-page.component.html',
  styleUrls: ['./play-view-page.component.css']
})
export class PlayViewPageComponent implements OnInit, OnDestroy {
  play: Play;
  subscriptions: Subscription[] = [];
  isCreator = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticateService: AuthenticateService
  ) {}

  ngOnInit() {
    if (this.route.data) {
      this.subscriptions.push(
        combineLatest([
          this.route.data,
          this.authenticateService.currentUser$
        ]).subscribe(([data, user]) => {
          if (data && data.play) {
            this.play = data.play;
          }
          if (this.play && user && this.play.creatorId === user.id) {
            this.isCreator = true;
          } else {
            this.isCreator = false;
          }
        })
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  gotoEdit() {
    this.router.navigate(['plays', this.play.id, 'edit']);
  }
}
