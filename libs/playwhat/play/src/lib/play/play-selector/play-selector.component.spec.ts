import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySelectorComponent } from './play-selector.component';

describe('PlaySelectorComponent', () => {
  let component: PlaySelectorComponent;
  let fixture: ComponentFixture<PlaySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
