import { Component, OnInit, Input } from '@angular/core';
import { Album } from '@ygg/shared/omni-types/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-album-view',
  templateUrl: './album-view.component.html',
  styleUrls: ['./album-view.component.css']
})
export class AlbumViewComponent implements OnInit {
  @Input() album: Album;
  @Input() value: Album;

  constructor() {}

  ngOnInit() {
    if (!this.album) {
      this.album = this.value;
    }
  }
}
