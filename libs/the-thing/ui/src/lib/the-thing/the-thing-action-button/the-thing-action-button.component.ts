import { Component, OnInit, Input } from '@angular/core';
import { TheThingAction } from '@ygg/the-thing/core';
import validator from 'validator';

type IconType = 'icon' | 'url';

@Component({
  selector: 'the-thing-action-button',
  templateUrl: './the-thing-action-button.component.html',
  styleUrls: ['./the-thing-action-button.component.css']
})
export class TheThingActionButtonComponent implements OnInit {
  @Input() action: TheThingAction;
  iconType: IconType;

  constructor() {}

  ngOnInit(): void {
    if (this.action) {
      if (this.action.icon) {
        if (
          validator.isURL(this.action.icon, {
            require_protocol: false,
            require_host: false
          })
        ) {
          this.iconType = 'url';
        } else {
          this.iconType = 'icon';
        }
      }
    }
  }
}
