import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenHourComponent } from './open-hour.component';

describe('OpenHourComponent', () => {
  let component: OpenHourComponent;
  let fixture: ComponentFixture<OpenHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
