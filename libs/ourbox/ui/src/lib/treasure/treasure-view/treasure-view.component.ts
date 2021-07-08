import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Treasure } from '@ygg/ourbox/core';
import { get } from 'lodash';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-treasure-view',
  templateUrl: './treasure-view.component.html',
  styleUrls: ['./treasure-view.component.css']
})
export class TreasureViewComponent implements OnInit {
  @Input() treasure: Treasure;

  constructor(private route: ActivatedRoute, private router: Router) {}

  get isProvisionSale() {
    const provision = get(this.treasure, 'provision', null);
    return provision && provision.isEqual(Treasure.provisionTypes[2]);
  }

  ngOnInit(): void {
    if (!this.treasure) {
      this.treasure = get(this.route.snapshot.data, 'treasure', null);
    }
  }

  gotoBox() {
    if (this.treasure.boxId) {
      this.router.navigate(['/', 'box', this.treasure.boxId]);
    }
  }
}
