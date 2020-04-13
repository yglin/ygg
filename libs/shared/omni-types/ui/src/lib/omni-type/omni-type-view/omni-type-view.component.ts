import { Component, OnInit, Input } from '@angular/core';
import { OmniTypeID } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-omni-type-view',
  templateUrl: './omni-type-view.component.html',
  styleUrls: ['./omni-type-view.component.css']
})
export class OmniTypeViewComponent implements OnInit {
  @Input() type: OmniTypeID;
  @Input() value: any;

  constructor() {}

  ngOnInit(): void {}
}
