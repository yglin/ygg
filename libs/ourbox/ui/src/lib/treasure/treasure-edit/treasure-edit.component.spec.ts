import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureEditComponent } from './treasure-edit.component';

describe('TreasureEditComponent', () => {
  let component: TreasureEditComponent;
  let fixture: ComponentFixture<TreasureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
