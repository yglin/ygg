import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from '../menu';

@Component({
  selector: 'ygg-grid-menu',
  templateUrl: './grid-menu.component.html',
  styleUrls: ['./grid-menu.component.css']
})
export class GridMenuComponent implements OnInit {
  @Input() menuItems: MenuItem[];

  constructor() {
    this.menuItems = [];
  }

  ngOnInit() {
  }

}
