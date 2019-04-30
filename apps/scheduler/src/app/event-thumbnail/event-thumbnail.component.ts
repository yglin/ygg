import { Component, OnInit, Input } from '@angular/core';
import { EventService, Event } from '@ygg/shared/domain/schedule';

@Component({
  selector: 'ygg-event-thumbnail',
  templateUrl: './event-thumbnail.component.html',
  styleUrls: ['./event-thumbnail.component.css']
})
export class EventThumbnailComponent implements OnInit {
  @Input() id: string;
  event: Event;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.eventService.get$(this.id).subscribe(event => this.event = event);
    }
  }

}
