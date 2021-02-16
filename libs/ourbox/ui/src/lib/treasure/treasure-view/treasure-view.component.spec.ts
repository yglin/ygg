import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureViewComponent } from './treasure-view.component';

describe('TreasureViewComponent', () => {
  let component: TreasureViewComponent;
  let fixture: ComponentFixture<TreasureViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
