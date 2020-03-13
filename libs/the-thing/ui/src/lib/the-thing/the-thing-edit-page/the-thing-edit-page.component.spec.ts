import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingEditPageComponent } from './the-thing-edit-page.component';

describe('TheThingEditPageComponent', () => {
  let component: TheThingEditPageComponent;
  let fixture: ComponentFixture<TheThingEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
