import { Component, OnInit, Input } from '@angular/core';
import { NumberRange } from './number-range';

@Component({
  selector: 'ygg-number-range',
  templateUrl: './number-range.component.html',
  styleUrls: ['./number-range.component.css']
})
export class NumberRangeComponent {
  @Input() range: NumberRange;
  @Input() unit: string;

  constructor() { }

}
