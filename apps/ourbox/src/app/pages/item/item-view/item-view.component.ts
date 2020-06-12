import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import {
  AuthenticateService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';
import { Observable, isObservable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ImitationItem } from '@ygg/ourbox/core';

@Component({
  selector: 'ygg-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit, OnDestroy {
  @Input() item$: Observable<TheThing>;
  item: TheThing;
  keeperId: string = 'cenKm7JFZTgqP307xmuE5SLIVtV2';
  standbyList: string[] = [
    'Wxnzu6zn8COBiS2UYtKEaOCUj3w2',
    'okUwmB5of3QQceFYGOAoPw1HgWk1'
  ];
  subscriptions: Subscription[] = [];
  ImitationItem = ImitationItem;

  constructor(
    private route: ActivatedRoute,
    private authUiService: AuthenticateUiService
  ) {}

  ngOnInit(): void {
    if (!this.item$) {
      this.item$ = this.route.snapshot.data.item$;
      // console.log(`Got item$ in route.snapshot.data`);
      // console.dir(this.item$);
    }
    if (isObservable(this.item$)) {
      this.subscriptions.push(this.item$.subscribe(item => (this.item = item)));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async askForIt() {
    const user = await this.authUiService.requireLogin();
    this.standbyList.push(user.id);
  }
}
