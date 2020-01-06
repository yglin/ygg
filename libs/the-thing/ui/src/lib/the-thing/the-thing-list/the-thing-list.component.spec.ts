import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingListComponent } from './the-thing-list.component';

describe('TheThingListComponent', () => {
  let component: TheThingListComponent;
  let fixture: ComponentFixture<TheThingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
