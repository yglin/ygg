import { Component } from '@angular/core';
import { ImitationPlay } from '@ygg/playwhat/core';

@Component({
  selector: 'ygg-my-play-list',
  templateUrl: './my-play-list.component.html',
  styleUrls: ['./my-play-list.component.css']
})
export class MyPlayListComponent {
  ImitationPlay = ImitationPlay;
}
