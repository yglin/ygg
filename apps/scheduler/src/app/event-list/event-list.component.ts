import { Component, OnInit, Input } from '@angular/core';
import { Event } from '@ygg/shared/domain/schedule';

@Component({
  selector: 'ygg-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  @Input() events: Event[];
  
  constructor() { }

  ngOnInit() {
  }

}
