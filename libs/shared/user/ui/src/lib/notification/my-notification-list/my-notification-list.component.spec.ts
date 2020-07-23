import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNotificationListComponent } from './my-notification-list.component';

describe('MyNotificationListComponent', () => {
  let component: MyNotificationListComponent;
  let fixture: ComponentFixture<MyNotificationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNotificationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
