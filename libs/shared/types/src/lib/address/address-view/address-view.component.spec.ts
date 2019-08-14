import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressViewComponent } from './address-view.component';
import { Address } from '../address';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

class AddressViewComponentPageObject {
  selector = '.address-view'
  selectors = {};

  getSelector(name?: string): string {
    if (name && name in this.selectors) {
      return `${this.selector} ${this.selectors[name]}`;
    } else {
      return `${this.selector}`;
    }
  }
}

describe('AddressViewComponent', () => {
  let component: AddressViewComponent;
  let fixture: ComponentFixture<AddressViewComponent>;
  let debugElement: DebugElement;
  const pageObject = new AddressViewComponentPageObject();

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
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    component.address = Address.forge();
    await fixture.whenStable();
    fixture.detectChanges();
    const addressElement: HTMLElement = debugElement.query(By.css(pageObject.getSelector())).nativeElement;
    expect(addressElement.innerHTML).toContain(component.address.getFullAddress());
    done();
  });
});
