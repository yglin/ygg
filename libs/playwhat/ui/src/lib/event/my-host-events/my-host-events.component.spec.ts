import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHostEventsComponent } from './my-host-events.component';

describe('MyHostEventsComponent', () => {
  let component: MyHostEventsComponent;
  let fixture: ComponentFixture<MyHostEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHostEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHostEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
