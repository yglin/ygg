import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingImitationViewComponent } from './the-thing-imitation-view.component';

describe('TheThingImitationViewComponent', () => {
  let component: TheThingImitationViewComponent;
  let fixture: ComponentFixture<TheThingImitationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingImitationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingImitationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
