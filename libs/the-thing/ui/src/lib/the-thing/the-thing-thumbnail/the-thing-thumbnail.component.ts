import { Component, OnInit, Input } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { Album } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'the-thing-thumbnail',
  templateUrl: './the-thing-thumbnail.component.html',
  styleUrls: ['./the-thing-thumbnail.component.css']
})
export class TheThingThumbnailComponent implements OnInit {
  @Input() theThing: TheThing;
  imageSrc = 'help';

  constructor() {}

  ngOnInit() {
    if (this.theThing) {
      for (const cellName in this.theThing.cells) {
        if (this.theThing.cells.hasOwnProperty(cellName)) {
          const cell = this.theThing.cells[cellName];
          if (cell.type === 'album') {
            this.imageSrc = (cell.value as Album).cover.src;
            break;
          }
        }
      }
    }
  }
}
