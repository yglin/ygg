import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Play } from '../play';
import { PlayService } from '../play.service';
import { Subscription } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { LogService } from '@ygg/shared/infra/log';

@Component({
  selector: 'ygg-play-thumbnail',
  templateUrl: './play-thumbnail.component.html',
  styleUrls: ['./play-thumbnail.component.css']
})
export class PlayThumbnailComponent implements OnInit, OnDestroy {
  @Input() id: string;
  play: Play;
  subscriptions: Subscription[] = [];

  constructor(
    private playService: PlayService,
    private logService: LogService
  ) {}

  ngOnInit() {
    if (this.id) {
      this.subscriptions.push(this.playService.get$(this.id).subscribe(play => {
        this.play = play;
      }, error => {
        this.logService.error(error);
        this.play = null;
      }));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
