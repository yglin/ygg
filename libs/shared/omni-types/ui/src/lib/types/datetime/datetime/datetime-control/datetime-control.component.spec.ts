import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeControlComponent } from './datetime-control.component';

describe('DatetimeControlComponent', () => {
  let component: DatetimeControlComponent;
  let fixture: ComponentFixture<DatetimeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatetimeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
