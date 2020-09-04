import { Component, OnInit, OnDestroy } from '@angular/core';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import { Observable, Subscription, Subject } from 'rxjs';
import {
  TheThingImitation,
  TheThingState,
  TheThing,
  TheThingStateChangeRecord
} from '@ygg/the-thing/core';
import { extend } from 'lodash';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'the-thing-the-thing-state-change-record',
  templateUrl: './the-thing-state-change-record.component.html',
  styleUrls: ['./the-thing-state-change-record.component.css']
})
export class TheThingStateChangeRecordComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  imitation: TheThingImitation;
  theThing: TheThing;
  oldState: TheThingState;
  newState: TheThingState;
  dialogData: {
    imitation: TheThingImitation;
    theThing: TheThing;
    oldState: TheThingState;
    newState: TheThingState;
  };
  dialogOutput$: Subject<TheThingStateChangeRecord> = new Subject();
  isInputValid = false;
  formGroup: FormGroup;
  subscription: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      message: null
    });

    this.subscription.add(
      this.formGroup.valueChanges.subscribe(value => {
        this.dialogOutput$.next(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (!!this.dialogData) {
      extend(this, this.dialogData);
    }

    this.isInputValid = !!(
      this.imitation &&
      this.theThing &&
      this.dialogData.newState
    );
  }
}
