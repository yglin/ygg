import 'hammerjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressControlComponent } from './address-control.component';
import { Component, DebugElement } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { Address } from '../address';
import { MockComponent } from "ng-mocks";
import { throwError } from 'rxjs';

class AddressControlComponentPageObject {
  selector = '.address-control'
  selectors = {
    rawInput: 'input#raw'
  };

  getSelector(name?: string): string {
    if (name && name in this.selectors) {
      return `${this.selector} ${this.selectors[name]}`;
    } else {
      return `${this.selector}`;
    }
  }
}

describe('AddressControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-address-control formControlName="address" [label]="addressLabel"></ygg-address-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    addressLabel: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        address: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: AddressControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;

  const pageObject = new AddressControlComponentPageObject();
  let rawInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        MockFormComponent, AddressControlComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(AddressControlComponent))
      .componentInstance;
    rawInput = debugElement.query(By.css(pageObject.getSelector('rawInput'))).nativeElement;
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.addressLabel = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    const rawInputElement = debugElement.query(By.css(pageObject.getSelector('rawInput')));
    expect(rawInputElement.attributes['placeholder']).toEqual(formComponent.addressLabel);
    done();
  });

  it('should read value from parent form', async done => {
    const testAddress = Address.forge();
    formComponent.formGroup.get('address').setValue(testAddress);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.address.toJSON()).toEqual(testAddress.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testAddress = Address.forge();
    component.address = testAddress;
    await fixture.whenStable();
    fixture.detectChanges();
    const address: Address = formComponent.formGroup.get(
      'address'
    ).value;
    expect(address.toJSON()).toEqual(testAddress.toJSON());
    done();
  });

  // Postpone this feature, can live without it
  // it('can select county and district', async done => {
  //   const result: Address = formComponent.formGroup.get('address').value;
  //   expect(result).toEqual(something);
  //   done();
  // });

  it('can input raw address', async done => {
    const testAddress = Address.forge();
    rawInput.value = testAddress.getFullAddress();
    rawInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    const result: Address = formComponent.formGroup.get('address').value;
    expect(result.getFullAddress()).toEqual(testAddress.getFullAddress());
    done();
  });
  
});
