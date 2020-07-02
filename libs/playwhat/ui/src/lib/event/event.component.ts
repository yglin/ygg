import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImitationEvent } from '@ygg/playwhat/core';
import { TheThing } from '@ygg/the-thing/core';
import { ActivatedRoute } from '@angular/router';
import { get } from 'lodash';

@Component({
  selector: 'ygg-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  event$: Observable<TheThing>;
  ImitationEvent = ImitationEvent;

  constructor(private route: ActivatedRoute) {
    this.event$ = get(route.snapshot.data, 'event$', null);
  }

  ngOnInit(): void {}
}
