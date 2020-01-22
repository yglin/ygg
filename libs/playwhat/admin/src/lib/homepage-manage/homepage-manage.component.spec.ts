import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageManageComponent } from './homepage-manage.component';

describe('HomepageManageComponent', () => {
  let component: HomepageManageComponent;
  let fixture: ComponentFixture<HomepageManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
