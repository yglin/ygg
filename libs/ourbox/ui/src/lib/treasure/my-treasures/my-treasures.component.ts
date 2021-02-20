import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Treasure } from '@ygg/ourbox/core';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { TreasureFinderService } from '../treasure-finder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-my-treasures',
  templateUrl: './my-treasures.component.html',
  styleUrls: ['./my-treasures.component.css']
})
export class MyTreasuresComponent implements OnInit {
  treasureIcon = Treasure.icon;
  treasures: Treasure[] = [];

  constructor(
    private auth: AuthenticateUiService,
    private treasureFinder: TreasureFinderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    const currentUser = await this.auth.requestLogin();
    this.treasures = await this.treasureFinder.findByOwner(currentUser);
  }

  gotoTreasure(treasure: Treasure) {
    this.router.navigate(['/', 'treasure', treasure.id]);
  }
}
