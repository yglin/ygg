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
      name: '寶物地圖',
      image: '/assets/map.png',
      path: '/map'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    if (this.hasMyBoxes) {
      this.links.push({
        id: 'my-board',
        name: '我的佈告欄',
        image: '/assets/board.png',
        path: '/board'
      })
    } else {
      this.links.push({
        id: 'create-box',
        name: '開新寶箱',
        image: '/assets/create-box.png',
        path: '/boxes/create'
      });
    }
  }
}
