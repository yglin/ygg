import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges
} from '@angular/core';
import * as moment from 'moment';
import { DATE_FORMATS } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'ygg-date-view',
  templateUrl: './date-view.component.html',
  styleUrls: ['./date-view.component.css']
})
export class DateViewComponent implements OnChanges {
  @Input() value: Date;
  dateText: string;

  constructor() {}

  // ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.value instanceof Date) {
      this.dateText = moment(this.value)
        .startOf('day')
        .format(DATE_FORMATS.display.date);
    }
  }
}
