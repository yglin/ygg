import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingFinderDialogComponent } from './the-thing-finder-dialog.component';

describe('TheThingFinderDialogComponent', () => {
  let component: TheThingFinderDialogComponent;
  let fixture: ComponentFixture<TheThingFinderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingFinderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingFinderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
