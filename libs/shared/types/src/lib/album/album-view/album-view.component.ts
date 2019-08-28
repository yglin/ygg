import { Component, OnInit, Input } from '@angular/core';
import { Album } from '../album';

@Component({
  selector: 'ygg-album-view',
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css']
})
export class AlbumViewComponent implements OnInit {
  @Input() album: Album;

  constructor() { }

  ngOnInit() {
  }

  showOnCover(index: number) {
    if (this.album && this.album.photos[index]) {
      this.album.cover = this.album.photos[index];
    }
  }
}
