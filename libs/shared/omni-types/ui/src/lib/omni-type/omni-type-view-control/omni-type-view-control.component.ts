import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { OmniTypeControlComponent } from '../omni-type-control/omni-type-control.component';
import { noop } from 'lodash';

@Component({
  selector: 'ygg-omni-type-view-control',
  templateUrl: './omni-type-view-control.component.html',
  styleUrls: ['./omni-type-view-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OmniTypeViewControlComponent),
      multi: true
    }
  ]
})
export class OmniTypeViewControlComponent
  implements OnInit, ControlValueAccessor {
  @Input() type: OmniTypeID;
  @Input() editable = false;
  @Input() viewStyle = {};
  value: any;
  onChange: (value: any) => any = noop;
  onTouched: () => any = noop;

  constructor(private dialog: YggDialogService) {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {}

  openControlDialog() {
    const dialogRef = this.dialog.open(OmniTypeControlComponent, {
      title: '編輯資料',
      data: {
        type: this.type,
        value: this.value
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value !== undefined) {
        this.value = value;
        this.onChange(value);
      }
    });
  }
}
