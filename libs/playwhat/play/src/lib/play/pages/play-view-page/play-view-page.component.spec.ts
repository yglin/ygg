import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayViewPageComponent } from './play-view-page.component';

describe('PlayViewPageComponent', () => {
  let component: PlayViewPageComponent;
  let fixture: ComponentFixture<PlayViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
