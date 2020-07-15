import { Component, OnInit, Input } from '@angular/core';
import { ServiceEvent } from '@ygg/schedule/core';
import { config } from '../../config';

@Component({
  selector: 'ygg-service-event-span',
  templateUrl: './service-event-span.component.html',
  styleUrls: ['./service-event-span.component.css']
})
export class ServiceEventSpanComponent implements OnInit {
  @Input() event: ServiceEvent;
  width: number;
  barStyle: any;
  showThumbnail = false;

  constructor() {}

  ngOnInit(): void {
    if (this.event) {
      const timeLength = this.event.getTimeLength();
      this.width = (timeLength / 30) * config.scheduler.display.halfHourLength;
      this.setStyle();
    }
  }

  setStyle() {
    this.barStyle = {
      'background-color': this.event.color
    };
  }

  onMouseOver() {
    this.showThumbnail = true;
  }

  onMouseLeave() {
    this.showThumbnail = false;
  }
}
