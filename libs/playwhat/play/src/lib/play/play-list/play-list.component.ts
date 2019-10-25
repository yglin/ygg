import { isArray } from "lodash";
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Play } from '../play';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'ygg-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.css']
})
export class PlayListComponent implements OnInit, OnDestroy {
  @Input() plays: Play[];
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.route.data) {
      this.subscriptions.push(this.route.data.subscribe(data => {
        if (data && isArray(data.plays)) {
          this.plays = data.plays;
        }
      }));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onClick(id: string) {
    this.router.navigate(['/', 'plays', id]);
  }
}
