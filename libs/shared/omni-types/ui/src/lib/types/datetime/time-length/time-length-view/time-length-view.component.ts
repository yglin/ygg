import { Component, OnInit, Input } from '@angular/core';
import { TimeLength } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-time-length-view',
  templateUrl: './time-length-view.component.html',
  styleUrls: ['./time-length-view.component.css']
})
export class TimeLengthViewComponent implements OnInit {
  @Input() value: TimeLength;
  
  constructor() { }

  ngOnInit(): void {
  }

}
