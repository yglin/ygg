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
      'background-color': hashStringToColor(this.event.name)
    };
  }

  onMouseOver() {
    this.showThumbnail = true;
  }

  onMouseLeave() {
    this.showThumbnail = false;
  }
}

// Refer. to https://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

// Refer. to https://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
function hashStringToColor(str) {
  const hash = djb2(str);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return (
    '#' +
    ('0' + r.toString(16)).substr(-2) +
    ('0' + g.toString(16)).substr(-2) +
    ('0' + b.toString(16)).substr(-2)
  );
}
