import { Component, OnInit, Input } from '@angular/core';
import { Address } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-address-view',
  templateUrl: './address-view.component.html',
  styleUrls: ['./address-view.component.css']
})
export class AddressViewComponent implements OnInit {
  @Input() address: Address;
  
  constructor() { }

  ngOnInit() {
  }

}
