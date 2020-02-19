// import 'hammerjs';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { AddressControlComponent } from './address-control.component';
// import { Component, DebugElement } from '@angular/core';
// import {
//   FormGroup,
//   FormBuilder,
//   FormsModule,
//   ReactiveFormsModule
// } from '@angular/forms';
// import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
// import { By } from '@angular/platform-browser';
// import { Address } from '@ygg/shared/omni-types/core';
// import { AddressControlPageObject } from "./address-control.component.po";
// import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';

// describe('AddressControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
//   @Component({
//     selector: 'ygg-welcome-to-my-form',
//     template:
//       '<form [formGroup]="formGroup"><ygg-address-control formControlName="address" [label]="addressLabel"></ygg-address-control></form>',
//     styles: ['']
//   })
//   class MockFormComponent {
//     formGroup: FormGroup;
//     addressLabel: string;
//     constructor(private formBuilder: FormBuilder) {
//       this.formGroup = this.formBuilder.group({
//         address: null
//       });
//     }
//   }

//   let formComponent: MockFormComponent;
//   let component: AddressControlComponent;
//   let debugElement: DebugElement;
//   let fixture: ComponentFixture<MockFormComponent>;
//   let pageObject: AddressControlComponentPageObject;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
//       declarations: [
//         MockFormComponent, AddressControlComponent
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MockFormComponent);
//     debugElement = fixture.debugElement;
//     formComponent = fixture.componentInstance;
//     component = debugElement.query(By.directive(AddressControlComponent))
//       .componentInstance;
//     jest.spyOn(window, 'confirm').mockImplementation(() => true);

//     const tester = new AngularJestTester({ debugElement });
//     pageObject = new AddressControlComponentPageObject(tester, '');

//     fixture.detectChanges();
//   });

//   it('should show @Input() label', async done => {
//     formComponent.addressLabel = 'BaBaYGG';
//     await fixture.whenStable();
//     fixture.detectChanges();
//     expect(pageObject.getLabel()).toEqual(formComponent.addressLabel);
//     done();
//   });

//   it('should read value from parent form', async done => {
//     const testAddress = Address.forge();
//     formComponent.formGroup.get('address').setValue(testAddress);
//     await fixture.whenStable();
//     fixture.detectChanges();
//     expect(component.address.getFullAddress()).toEqual(testAddress.getFullAddress());
//     done();
//   });

//   it('should output changed value to parent form', async done => {
//     const testAddress = Address.forge();
//     pageObject.setValue(testAddress);
//     await fixture.whenStable();
//     fixture.detectChanges();
//     const address: Address = formComponent.formGroup.get(
//       'address'
//     ).value;
//     expect(address.getFullAddress()).toEqual(testAddress.getFullAddress());
//     done();
//   });
// });
