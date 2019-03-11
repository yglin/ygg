import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEcpayComponent } from './payment-ecpay.component';

describe('PaymentEcpayComponent', () => {
  let component: PaymentEcpayComponent;
  let fixture: ComponentFixture<PaymentEcpayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentEcpayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentEcpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
