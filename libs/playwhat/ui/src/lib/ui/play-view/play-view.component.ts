import { Component, OnInit, Input } from '@angular/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { RelationAddition } from '@ygg/shopping/core';

@Component({
  selector: 'ygg-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent implements OnInit, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  RelationAddition = RelationAddition;

  constructor() { }

  ngOnInit() {
  }

}
