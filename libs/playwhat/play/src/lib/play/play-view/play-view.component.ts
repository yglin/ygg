import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Play } from '../play';
import { PlayService } from '../play.service';

@Component({
  selector: 'ygg-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent implements OnInit {
  @Input() play: Play;

  constructor(
    private route: ActivatedRoute,
    private playService: PlayService
  ) {}

  ngOnInit() {
    if (!this.play) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.playService.get$(id).subscribe(play => {
          if (play) {
            this.play = play;
          }
        });
      }
    }
  }
}
