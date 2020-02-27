import { Component, OnInit, Input } from '@angular/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';

@Component({
  selector: 'ygg-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent implements OnInit, TheThingImitationViewInterface {
  @Input() theThing: TheThing;

  constructor() { }

  ngOnInit() {
  }

}
