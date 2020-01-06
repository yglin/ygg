import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingFinderComponent } from './the-thing-finder.component';

describe('TheThingFinderComponent', () => {
  let component: TheThingFinderComponent;
  let fixture: ComponentFixture<TheThingFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
