import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProviderLinkComponent } from './user-provider-link.component';

describe('UserProviderLinkComponent', () => {
  let component: UserProviderLinkComponent;
  let fixture: ComponentFixture<UserProviderLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProviderLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProviderLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
