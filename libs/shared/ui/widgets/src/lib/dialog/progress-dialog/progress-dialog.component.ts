import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, isObservable, Subscription } from 'rxjs';
import { YggDialogContentComponent } from '../ygg-dialog';

@Component({
  selector: 'ygg-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.css']
})
export class ProgressDialogComponent implements OnInit, OnDestroy, YggDialogContentComponent {
  message: string;
  percentage: number;
  dialogData: { message$: Observable<string>; percentage$: Observable<number> };
  subscription: Subscription = new Subscription();

  constructor() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.dialogData) {
      // console.log(this.dialogData);
      if (isObservable(this.dialogData.message$)) {
        this.subscription.add(
          this.dialogData.message$.subscribe(
            message => (this.message = message)
          )
        );
        // console.log('Subscribe to message$');
      }
      if (isObservable(this.dialogData.percentage$)) {
        this.subscription.add(
          this.dialogData.percentage$.subscribe(
            percentage => (this.percentage = percentage)
          )
        );
      }
    }
  }
}
