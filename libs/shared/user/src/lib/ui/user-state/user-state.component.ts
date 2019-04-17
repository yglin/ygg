import { Component, Input, OnChanges } from '@angular/core';
import { UserState } from '../../models/user';

@Component({
  selector: 'ygg-user-state',
  templateUrl: './user-state.component.html',
  styleUrls: ['./user-state.component.css']
})
export class UserStateComponent implements OnChanges {
  @Input() state: UserState;
  label: string;

  constructor() { }

  ngOnChanges() {
    switch (this.state) {
      case UserState.New:
        this.label = "新鮮人"
        break;
    
        case UserState.Activated:
        this.label = "村民"
        break;
    
        case UserState.Suspended:
        this.label = "流放中"
        break;
    
        case UserState.Retired:
        this.label = "已退休"
        break;
    
      default:
        this.label = "外太空"
        break;
    }
  }

}
