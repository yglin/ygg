import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionEditDialogComponent } from './addition-edit-dialog.component';

describe('AdditionEditDialogComponent', () => {
  let component: AdditionEditDialogComponent;
  let fixture: ComponentFixture<AdditionEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
