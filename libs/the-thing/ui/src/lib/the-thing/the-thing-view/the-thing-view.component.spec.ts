import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingViewComponent } from './the-thing-view.component';

describe('TheThingViewComponent', () => {
  let component: TheThingViewComponent;
  let fixture: ComponentFixture<TheThingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
