import { Component, OnInit } from '@angular/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'ygg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hasMyBoxes: boolean = false;

  links: ImageThumbnailItem[] = [
    {
      id: 'map-search',
      name: '撿寶地圖',
      image: '/assets/images/map.png',
      path: '/map'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    if (this.hasMyBoxes) {
      this.links.push({
        id: 'my-board',
        name: '佈告欄',
        image: '/assets/images/board.png',
        path: '/board'
      });
    } else {
      this.links.push({
        id: 'create-box',
        name: '開新寶箱',
        image: '/assets/images/box/create.png',
        path: '/ourbox/create'
      });
    }
  }
}
