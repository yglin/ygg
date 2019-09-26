import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsAdminUserOptionsComponent } from './tags-admin-user-options.component';

describe('TagsAdminUserOptionsComponent', () => {
  let component: TagsAdminUserOptionsComponent;
  let fixture: ComponentFixture<TagsAdminUserOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsAdminUserOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsAdminUserOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
