import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureMapComponent } from './treasure-map.component';

describe('TreasureMapComponent', () => {
  let component: TreasureMapComponent;
  let fixture: ComponentFixture<TreasureMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
