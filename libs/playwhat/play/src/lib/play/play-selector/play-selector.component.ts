import { isEmpty, find } from "lodash";
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Play } from '../play';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { Router } from '@angular/router';
// import { EventEmitter } from 'events';

@Component({
  selector: 'ygg-play-selector',
  templateUrl: './play-selector.component.html',
  styleUrls: ['./play-selector.component.css']
})
export class PlaySelectorComponent {
  @Input() plays: Play[];
  @Output() clickPlay: EventEmitter<Play> = new EventEmitter();
  
  constructor(private router: Router) { }

  onClickItem(item: Play) {
    this.clickPlay.emit(item);
  }

  onClickAdd() {
    this.router.navigate(['/plays', 'new']);
  }
}
