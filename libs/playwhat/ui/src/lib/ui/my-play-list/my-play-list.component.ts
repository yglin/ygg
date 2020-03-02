import { Component, OnInit } from '@angular/core';
import { ImitationPlay } from '@ygg/playwhat/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ygg-my-play-list',
  templateUrl: './my-play-list.component.html',
  styleUrls: ['./my-play-list.component.css']
})
export class MyPlayListComponent implements OnInit {
  ImitationPlay = ImitationPlay;

  constructor(private router: Router) {}

  ngOnInit() {}

  gotoCreate() {
    this.router.navigate(['/', 'the-things', 'create', ImitationPlay.id]);
  }
}
