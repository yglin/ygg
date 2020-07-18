import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatBadgeSize, MatBadge } from '@angular/material/badge';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import { isEmpty } from 'lodash';
import { from, fromEvent, Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[ygg-error-messages]',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.css']
})
export class ErrorMessagesComponent
  implements OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('ygg-error-messages') errorMessages: string[];
  numErrors = 0;
  hidden = true;

  constructor(private snackbar: MatSnackBar, private element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.numErrors = isEmpty(this.errorMessages)
      ? 0
      : this.errorMessages.length;
    this.hidden = this.numErrors <= 0;
  }

  onClickBadge(): void {
    if (!isEmpty(this.errorMessages)) {
      let previousSnackBarRef: MatSnackBarRef<SimpleSnackBar>;
      for (const message of this.errorMessages) {
        if (previousSnackBarRef) {
          previousSnackBarRef.afterDismissed().subscribe(() => {
            previousSnackBarRef = this.snackbar.open(message, 'X', {
              duration: 3000
            });
          });
        } else {
          previousSnackBarRef = this.snackbar.open(message, 'X', {
            duration: 3000
          });
        }
      }
    }
  }
}
