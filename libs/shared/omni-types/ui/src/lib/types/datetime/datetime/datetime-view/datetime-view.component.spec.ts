import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeViewComponent } from './datetime-view.component';

describe('DatetimeViewComponent', () => {
  let component: DatetimeViewComponent;
  let fixture: ComponentFixture<DatetimeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatetimeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
