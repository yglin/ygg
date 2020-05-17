import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import {
  AuthenticateService,
  AuthenticateUiService
} from '@ygg/shared/user/ui';

@Component({
  selector: 'ygg-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  item: TheThing = TheThing.forge();
  keeperId: string = 'cenKm7JFZTgqP307xmuE5SLIVtV2';
  standbyList: string[] = [
    'Wxnzu6zn8COBiS2UYtKEaOCUj3w2',
    'okUwmB5of3QQceFYGOAoPw1HgWk1'
  ];

  constructor(private authUiService: AuthenticateUiService) {}

  ngOnInit(): void {}

  async askForIt() {
    const user = await this.authUiService.requireLogin();
    this.standbyList.push(user.id);
  }
}
