import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcpaySendOrderComponent } from './ecpay-send-order.component';

describe('EcpaySendOrderComponent', () => {
  let component: EcpaySendOrderComponent;
  let fixture: ComponentFixture<EcpaySendOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcpaySendOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcpaySendOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
