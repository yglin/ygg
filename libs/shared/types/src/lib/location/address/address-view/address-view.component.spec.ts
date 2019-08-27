import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressViewComponent } from './address-view.component';
import { Address } from '../address';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';
import { AddressViewComponentPageObject } from "./address-view.component.po";

describe('AddressViewComponent', () => {
  let component: AddressViewComponent;
  let fixture: ComponentFixture<AddressViewComponent>;
  let debugElement: DebugElement;
  let pageObject: AddressViewComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    const tester = new AngularJestTester({debugElement});
    pageObject = new AddressViewComponentPageObject(tester, '');

    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    component.address = Address.forge();
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(component.address);
    done();
  });
});
