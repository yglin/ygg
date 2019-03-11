import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUnderTableComponent } from './payment-under-table.component';

describe('PaymentUnderTableComponent', () => {
  let component: PaymentUnderTableComponent;
  let fixture: ComponentFixture<PaymentUnderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentUnderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUnderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
