import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingCreatorComponent } from './the-thing-creator.component';

describe('TheThingCreatorComponent', () => {
  let component: TheThingCreatorComponent;
  let fixture: ComponentFixture<TheThingCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
