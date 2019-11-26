import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentThumbnailComponent } from './equipment-thumbnail.component';

describe('EquipmentThumbnailComponent', () => {
  let component: EquipmentThumbnailComponent;
  let fixture: ComponentFixture<EquipmentThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
