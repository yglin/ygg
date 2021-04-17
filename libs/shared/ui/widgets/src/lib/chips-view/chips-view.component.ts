import { Component, Input, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-chips-view',
  templateUrl: './chips-view.component.html',
  styleUrls: ['./chips-view.component.css']
})
export class ChipsViewComponent implements OnInit {
  @Input() value: string[];

  constructor() {}

  ngOnInit(): void {
    // console.log('ygg-chips-view');
    // console.dir(this.value);
  }
}
