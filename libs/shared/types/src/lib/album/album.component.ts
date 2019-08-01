import { Component, OnInit, Input } from '@angular/core';
import { Album } from './album';

@Component({
  selector: 'ygg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
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
