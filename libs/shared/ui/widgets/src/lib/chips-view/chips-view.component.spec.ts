import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipsViewComponent } from './chips-view.component';

describe('ChipsViewComponent', () => {
  let component: ChipsViewComponent;
  let fixture: ComponentFixture<ChipsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
