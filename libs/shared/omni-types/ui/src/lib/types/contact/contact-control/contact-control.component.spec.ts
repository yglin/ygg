import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactControlComponent } from './contact-control.component';
import { Component, DebugElement } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { Contact } from '../contact';
import { ContactControlPageObject } from './contact-control.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';

class ContactControlPageObjectAngularJest extends ContactControlPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async setValue(contact: Contact) {
    await this.tester.inputText(this.getSelector('inputName'), contact.name);
    await this.tester.inputText(
      this.getSelector('inputPhone'),
      contact.phone || ''
    );
    await this.tester.inputText(
      this.getSelector('inputEmail'),
      contact.email || ''
    );
    await this.tester.inputText(
      this.getSelector('inputLineID'),
      contact.lineID || ''
    );
  }
}

describe('ContactControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-contact-control formControlName="contact"></ygg-contact-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    label: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        contact: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: ContactControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;
  let pageObject: ContactControlPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [MockFormComponent, ContactControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(ContactControlComponent))
      .componentInstance;
    const tester = new AngularJestTester({ fixture, debugElement });
    pageObject = new ContactControlPageObjectAngularJest('', tester);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should read value from parent form', async done => {
    const testContact = Contact.forge();
    formComponent.formGroup.get('contact').setValue(testContact);
    await fixture.whenStable();
    fixture.detectChanges();
    const innerContact = new Contact().fromJSON(component.contactForm.value);
    expect(innerContact.toJSON()).toEqual(testContact.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testContact = Contact.forge();
    await pageObject.setValue(testContact);
    await fixture.whenStable();
    fixture.detectChanges();
    const contact: Contact = formComponent.formGroup.get('contact').value;
    expect(contact.toJSON()).toEqual(testContact.toJSON());
    done();
  });

});
