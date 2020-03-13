import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminThingsDataTableComponent } from './admin-things-data-table.component';

describe('AdminThingsDataTableComponent', () => {
  let component: AdminThingsDataTableComponent;
  let fixture: ComponentFixture<AdminThingsDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminThingsDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminThingsDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
