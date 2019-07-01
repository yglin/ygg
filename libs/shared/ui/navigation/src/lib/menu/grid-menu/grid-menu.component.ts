import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from '../menu';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ygg-grid-menu',
  templateUrl: './grid-menu.component.html',
  styleUrls: ['./grid-menu.component.css']
})
export class GridMenuComponent implements OnInit {
  @Input() menuItems: MenuItem[];

  constructor(
    public route: ActivatedRoute
  ) {
    this.menuItems = [];
    const routeData = route.snapshot.data;
    if (routeData && routeData.menuItems) {
      // console.log(routeData);
      this.menuItems = routeData.menuItems;
    }
  }

  ngOnInit() {
  }

}
