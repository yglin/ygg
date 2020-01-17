import { noop } from 'lodash';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SecurityContext,
  forwardRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Html } from '@ygg/shared/omni-types/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-html-control',
  templateUrl: './html-control.component.html',
  styleUrls: ['./html-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlControlComponent),
      multi: true
    }
  ]
})
export class HtmlControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  editor = ClassicEditor;
  formControlContent: FormControl;
  emitChange: (value: Html) => any = noop;
  emitTouched: () => any = noop;
  subscriptions: Subscription[] = [];

  constructor(private domSanitizer: DomSanitizer) {
    this.formControlContent = new FormControl('');
    this.subscriptions.push(
      this.formControlContent.valueChanges.subscribe(value => {
        const html = new Html(
          domSanitizer.sanitize(SecurityContext.HTML, value)
        );
        this.emitChange(html);
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Html) {
    if (value) {
      this.formControlContent.setValue(value.content);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {
    this.emitTouched = fn;
  }
}
