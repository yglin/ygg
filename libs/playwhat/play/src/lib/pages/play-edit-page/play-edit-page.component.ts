import { Component, OnInit } from '@angular/core';
import { Play } from '../../play';
import { ActivatedRoute } from '@angular/router';
import { take, first, timeout } from 'rxjs/operators';

@Component({
  selector: 'ygg-play-edit-page',
  templateUrl: './play-edit-page.component.html',
  styleUrls: ['./play-edit-page.component.css']
})
export class PlayEditPageComponent implements OnInit {
  play: Play;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route.data) {
      this.route.data
        .pipe(
          timeout(5000),
          first(play => !!play)
        )
        .subscribe((data: any) => {
          if (data && data.play) {
            this.play = data.play;
          } else {
            this.play = new Play();
          }
        });
    } else {
      this.play = new Play();
    }
  }

  onPlayChanged(play: Play) {
    if (play) {
      this.play = play;
    }
  }
}
