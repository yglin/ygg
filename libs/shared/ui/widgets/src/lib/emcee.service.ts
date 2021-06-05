import { Injectable, OnDestroy } from '@angular/core';
import { Emcee, AlertType } from '@ygg/shared/infra/core';
import { YggDialogService } from './dialog';
import { Observable, Subject, of, Subscription, ReplaySubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressDialogComponent } from './dialog/progress-dialog/progress-dialog.component';
import { ProgressDialogData } from './dialog/progress-dialog/progress-dialog';
import { debounceTime } from 'rxjs/operators';
import { extend } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmceeService extends Emcee implements OnDestroy {
  progressHideDelay = 1000;
  progressDialogRef: MatDialogRef<ProgressDialogComponent>;
  progressDialogData$ = {
    message$: new ReplaySubject<string>(1),
    percentage$: new ReplaySubject<number>(1)
  };
  progressDialogShow$ = new Subject<ProgressDialogData>();
  progressDialogHide$ = new Subject<boolean>();
  subscription: Subscription = new Subscription();

  configs: any = {};

  constructor(private dialog: YggDialogService) {
    super();
    this.subscription.add(
      this.progressDialogShow$.subscribe((data: ProgressDialogData) => {
        if (!this.progressDialogRef) {
          this.progressDialogRef = this.dialog.open(ProgressDialogComponent, {
            panelClass: ['transparent'],
            data: {
              message$: this.progressDialogData$.message$,
              percentage$: this.progressDialogData$.percentage$
            }
          });
        }
        this.progressDialogData$.message$.next(data.message);
        this.progressDialogData$.percentage$.next(data.percentage);
        this.progressDialogHide$.next(false);
      })
    );
    this.subscription.add(
      this.progressDialogHide$
        .pipe(debounceTime(this.progressHideDelay))
        .subscribe(doHide => {
          if (doHide && this.progressDialogRef) {
            this.progressDialogRef.close();
            this.progressDialogRef = undefined;
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  config(options: any = {}) {
    extend(this.configs, options);
  }

  async alert(message: string, type: AlertType) {
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return this.dialog.alert(message, type, this.configs);
  }

  async confirm(message: string): Promise<boolean> {
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return this.dialog.confirm(message);
  }

  showProgress(options: ProgressDialogData = {}): void {
    this.progressDialogShow$.next(options);
  }

  hideProgress(): void {
    this.progressDialogHide$.next(true);
  }
}
