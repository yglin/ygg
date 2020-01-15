import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingFilterComponent } from './the-thing-filter.component';

describe('TheThingFilterComponent', () => {
  let component: TheThingFilterComponent;
  let fixture: ComponentFixture<TheThingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
