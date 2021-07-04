import { Component, Input, OnInit } from '@angular/core';
import { ProvisionType } from '@ygg/ourbox/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-provision-label',
  templateUrl: './provision-label.component.html',
  styleUrls: ['./provision-label.component.css']
})
export class ProvisionLabelComponent implements OnInit {
  @Input() value: ProvisionType;

  constructor() { }

  ngOnInit(): void {
  }

}
