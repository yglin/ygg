import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayEditPageComponent } from './play-edit-page.component';

describe('PlayEditPageComponent', () => {
  let component: PlayEditPageComponent;
  let fixture: ComponentFixture<PlayEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
