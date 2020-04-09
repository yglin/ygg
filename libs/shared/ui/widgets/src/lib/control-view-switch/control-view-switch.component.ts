import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-control-view-switch',
  templateUrl: './control-view-switch.component.html',
  styleUrls: ['./control-view-switch.component.css']
})
export class ControlViewSwitchComponent implements OnInit {
  @Input() readonly = false;
  showControl = false;

  constructor() { }

  ngOnInit(): void {
  }

}
