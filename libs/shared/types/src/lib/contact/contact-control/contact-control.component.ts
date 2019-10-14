import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormGroup,
  FormBuilder,
  AbstractControl,
  ControlValueAccessor,
  Validator
} from '@angular/forms';
import { Contact } from '../contact';
import { Subscription } from 'rxjs';

class LeastRequireErrorMatcher implements ErrorStateMatcher {
  fields: string[];

  constructor(fields: string[]) {
    this.fields = fields;
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    if (!control.touched) {
      return false;
    } else {
      if (control.invalid) {
        return true;
      }
      let noOneHasValue = true;
      for (const field of this.fields) {
        if (control.parent.get(field).value) {
          noOneHasValue = false;
          break;
        }
      }
      return noOneHasValue;
    }
  }
}

@Component({
  selector: 'ygg-contact-control',
  templateUrl: './contact-control.component.html',
  styleUrls: ['./contact-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactControlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ContactControlComponent),
      multi: true
    }
  ]
})
export class ContactControlComponent
  implements OnDestroy, ControlValueAccessor, Validator {
  contactForm: FormGroup;
  leastRequireErrorMatcher = new LeastRequireErrorMatcher(['email', 'phone']);
  emitChange: (contact: Contact) => any;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group(
      {
        name: '',
        phone: '',
        email: '',
        lineID: ''
      },
      {
        validator: this.requireEmailOrPhoneValidator
      }
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(contact: Contact) {
    if (Contact.isContact(contact)) {
      this.contactForm.reset();
      this.contactForm.patchValue(contact);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
    // alert('registerOnChange!!!');
    this.subscriptions.push(
      this.contactForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe(contactValue => {
          // console.log('Contact changed~!!!');
          // console.log(contact);
          this.emitChange(new Contact().fromJSON(contactValue));
        })
    );
  }

  registerOnTouched(fn) {}

  requireEmailOrPhoneValidator(formGroup: FormGroup): any {
    if (formGroup.get('phone').value || formGroup.get('email').value) {
      return null;
    } else {
      return {
        requireEmailOrPhone: true
      };
    }
  }

  public validate(c: AbstractControl): { [key: string]: any } {
    // console.log('I am called');
    if (this.contactForm.invalid) {
      const errors = {};
      for (const key in this.contactForm.controls) {
        if (this.contactForm.controls.hasOwnProperty(key)) {
          const control = this.contactForm.controls[key];
          control.markAsTouched({ onlySelf: true });
          errors[key] = control.errors;
        }
      }
      // console.dir(errors);
      return errors;
    } else {
      return null;
    }
  }
}
