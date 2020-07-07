import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as moment from 'moment';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-datetime-view',
  templateUrl: './datetime-view.component.html',
  styleUrls: ['./datetime-view.component.css']
})
export class DatetimeViewComponent implements OnChanges {
  @Input() value: Date;
  dayTimeText: string;

  constructor() {}

  // ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.value instanceof Date) {
      this.dayTimeText = moment(this.value).format('HH:mm');
    }
  }
}
