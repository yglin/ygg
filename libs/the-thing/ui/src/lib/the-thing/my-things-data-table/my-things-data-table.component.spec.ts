import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyThingsDataTableComponent } from './my-things-data-table.component';

describe('MyThingsDataTableComponent', () => {
  let component: MyThingsDataTableComponent;
  let fixture: ComponentFixture<MyThingsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyThingsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyThingsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
