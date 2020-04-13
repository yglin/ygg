import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Observable } from 'rxjs';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { get, noop } from 'lodash';

@Component({
  selector: 'ygg-omni-type-control',
  templateUrl: './omni-type-control.component.html',
  styleUrls: ['./omni-type-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OmniTypeControlComponent),
      multi: true
    }
  ]
})
export class OmniTypeControlComponent
  implements OnInit, YggDialogContentComponent, ControlValueAccessor {
  @Input() type: OmniTypeID;
  dialogData: any;
  dialogOutput$: Observable<any>;
  formControl: FormControl = new FormControl();
  onChange: (value: any) => any = noop;
  onTouched: () => any = noop;

  constructor() {
    this.dialogOutput$ = this.formControl.valueChanges;
    this.formControl.valueChanges.subscribe(value => this.emitChange(value));
  }

  emitChange(value: any) {
    // console.log(`OmniTypeControl emit ${value}`);
    // console.dir(value);
    this.onChange(value);
  }

  ngOnInit() {
    this.type = this.type || get(this.dialogData, 'type');
    const dialogValue = get(this.dialogData, 'value');
    if (!!dialogValue) {
      this.writeValue(dialogValue);
    }
  }

  writeValue(value: any): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
