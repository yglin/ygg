import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersByEmailSelectorComponent } from './users-by-email-selector.component';

describe('UsersByEmailSelectorComponent', () => {
  let component: UsersByEmailSelectorComponent;
  let fixture: ComponentFixture<UsersByEmailSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersByEmailSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersByEmailSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
