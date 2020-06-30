import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEventSpanComponent } from './service-event-span.component';

describe('ServiceEventSpanComponent', () => {
  let component: ServiceEventSpanComponent;
  let fixture: ComponentFixture<ServiceEventSpanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEventSpanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEventSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
