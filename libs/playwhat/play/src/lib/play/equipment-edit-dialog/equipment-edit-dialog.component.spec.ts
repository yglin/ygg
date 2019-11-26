import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentEditDialogComponent } from './equipment-edit-dialog.component';

describe('EquipmentEditDialogComponent', () => {
  let component: EquipmentEditDialogComponent;
  let fixture: ComponentFixture<EquipmentEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
