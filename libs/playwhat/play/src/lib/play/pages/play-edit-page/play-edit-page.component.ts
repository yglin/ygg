import { Component, OnInit } from '@angular/core';
import { Play } from '../..';
import { ActivatedRoute, Router } from '@angular/router';
import { take, first, timeout } from 'rxjs/operators';
import { AuthenticateService } from "@ygg/shared/user/ui";
import { PlayFactoryService } from '../../play-factory.service';

@Component({
  selector: 'ygg-play-edit-page',
  templateUrl: './play-edit-page.component.html',
  styleUrls: ['./play-edit-page.component.css']
})
export class PlayEditPageComponent implements OnInit {
  play: Play;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playFactory: PlayFactoryService
  ) {}

  async ngOnInit() {
    if (this.route.data) {
      this.route.data
        .pipe(
          timeout(5000),
          first(play => !!play)
        )
        .subscribe(async (data: any) => {
          if (data && data.play) {
            this.play = data.play;
          } else {
            this.play = await this.playFactory.create();
          }
        });
    } else {
      this.play = await this.playFactory.create();
    }
  }

  onPlayChanged(play: Play) {
    if (play) {
      this.play = play;
    }
  }

  onPlaySubmitted(play: Play) {
    if (play) {
      this.router.navigate(['/', 'plays', play.id]);
    }
  }
}
