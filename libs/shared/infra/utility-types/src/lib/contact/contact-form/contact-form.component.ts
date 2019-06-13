import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material';
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
import { User, AuthenticateService } from '@ygg/shared/user';
import { Observable, Subscription } from 'rxjs';

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
  selector: 'ygg-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ContactFormComponent),
      multi: true
    }
  ]
})
export class ContactFormComponent implements OnDestroy, ControlValueAccessor, Validator {
  contactForm: FormGroup;
  leastRequireErrorMatcher = new LeastRequireErrorMatcher(['email', 'phone']);
  emitChange: (contact: Contact) => any;
  currentUser: User;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticateService
  ) {
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

    this.subscription = this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  fillWithMe() {
    if (this.currentUser) {
      this.contactForm.get('name').setValue(this.currentUser.name);
      this.contactForm.get('phone').setValue(this.currentUser.phone);
      this.contactForm.get('email').setValue(this.currentUser.email);
      // this.contactForm.get('lineID').setValue(this.currentUser.lineID);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(contact: Contact) {
    if (contact) {
      this.contactForm.patchValue(contact);
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
    // alert('registerOnChange!!!');
    this.contactForm.valueChanges.pipe(debounceTime(500)).subscribe(contact => {
      // console.log('Contact changed~!!!');
      // console.log(contact);
      this.emitChange(contact);
    });
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
