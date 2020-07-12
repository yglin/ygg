import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationEvent } from '@ygg/playwhat/core';
import { EventFactoryService } from '../../event-factory.service';

@Component({
  selector: 'ygg-my-host-events',
  templateUrl: './my-host-events.component.html',
  styleUrls: ['./my-host-events.component.css']
})
export class MyHostEventsComponent implements OnInit {
  myHostEvents$: Observable<TheThing[]>;
  ImitationEvent = ImitationEvent;

  constructor(private eventFactory: EventFactoryService) {}

  async ngOnInit() {
    this.myHostEvents$ = await this.eventFactory.listMyHostEvents$();
  }
}
