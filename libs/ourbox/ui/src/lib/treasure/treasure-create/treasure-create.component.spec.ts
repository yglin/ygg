import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureCreateComponent } from './treasure-create.component';

describe('TreasureCreateComponent', () => {
  let component: TreasureCreateComponent;
  let fixture: ComponentFixture<TreasureCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
