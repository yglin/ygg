import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseControlComponent } from './purchase-control.component';

describe('PurchaseControlComponent', () => {
  let component: PurchaseControlComponent;
  let fixture: ComponentFixture<PurchaseControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
