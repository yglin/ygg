import { Component, OnInit, Input } from '@angular/core';
import { ItemViewComponent } from '../item-view/item-view.component';
import { Item } from '@ygg/ourbox/core';
import { TheThing } from '@ygg/the-thing/core';

@Component({
  selector: 'ygg-item-thumbnail',
  templateUrl: './item-thumbnail.component.html',
  styleUrls: ['./item-thumbnail.component.css']
})
export class ItemThumbnailComponent implements OnInit {
  @Input() id: string;
  item: Item;

  constructor() {
    this.item = TheThing.forge();
  }

  ngOnInit(): void {}
}
