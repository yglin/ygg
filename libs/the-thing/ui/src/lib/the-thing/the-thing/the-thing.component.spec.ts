import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingComponent } from './the-thing.component';

describe('TheThingComponent', () => {
  let component: TheThingComponent;
  let fixture: ComponentFixture<TheThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
