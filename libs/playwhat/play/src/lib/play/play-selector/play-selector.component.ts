import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Play } from '../play';
// import { EventEmitter } from 'events';

@Component({
  selector: 'ygg-play-selector',
  templateUrl: './play-selector.component.html',
  styleUrls: ['./play-selector.component.css']
})
export class PlaySelectorComponent implements OnInit {
  @Input() plays: Play[];
  @Output() clickPlay: EventEmitter<Play> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  onClickPlay(play: Play) {
    this.clickPlay.emit(play);
  }
}
