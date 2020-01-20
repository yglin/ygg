import * as moment from 'moment';
import { Component, OnInit, Input } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { Album } from '@ygg/shared/types';

@Component({
  selector: 'ygg-play-card',
  templateUrl: './play-card.component.html',
  styleUrls: ['./play-card.component.css']
})
export class PlayCardComponent implements OnInit {
  @Input() play: TheThing;
  price: number;
  timeLength: string;
  subtitle: string;
  introduction: string;
  minParticipants: number;
  maxParticipants: number;
  album: Album;

  constructor() {}

  ngOnInit() {
    if (this.play) {
      this.price = this.play.cells['費用'].value;
      this.timeLength = this.humanizeDuration(this.play.cells['時長'].value);
      this.subtitle = this.play.cells['副標題'].value;
      this.introduction = this.play.cells['簡介'].value;
      this.minParticipants = this.play.cells['人數下限'].value;
      this.maxParticipants = this.play.cells['人數上限'].value;
      this.album = this.play.cells['照片'].value;
    }
  }

  humanizeDuration(timeLength: number): string {
    return moment
      .duration(timeLength, 'minutes')
      .locale('zh-tw')
      .humanize();
  }
}
