import { Component, OnInit, Inject } from '@angular/core';
import { YggDialogContentComponent } from '../ygg-dialog';
import { Observable, Subject, of } from 'rxjs';
import { IConfirmDialogInput } from './confirm-dialog.component.po';

@Component({
  selector: 'ygg-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent
  implements OnInit, YggDialogContentComponent {
  constructor() {}
  dialogData: any;
  dialogOutput$: Observable<boolean> = of(true);

  ngOnInit(): void {}

  // cancel() {
  //   this.dialogOutput$.next(false);
  // }

  // confirm() {
  //   this.dialogOutput$.next(true);
  // }
}
