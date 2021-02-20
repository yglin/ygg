import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTreasuresComponent } from './my-treasures.component';

describe('MyTreasuresComponent', () => {
  let component: MyTreasuresComponent;
  let fixture: ComponentFixture<MyTreasuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTreasuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTreasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
