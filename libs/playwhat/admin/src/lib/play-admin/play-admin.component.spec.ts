import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAdminComponent } from './play-admin.component';

describe('PlayAdminComponent', () => {
  let component: PlayAdminComponent;
  let fixture: ComponentFixture<PlayAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
