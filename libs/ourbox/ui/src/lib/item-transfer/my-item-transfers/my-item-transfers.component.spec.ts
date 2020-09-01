import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyItemTransfersComponent } from './my-item-transfers.component';

describe('MyItemTransfersComponent', () => {
  let component: MyItemTransfersComponent;
  let fixture: ComponentFixture<MyItemTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyItemTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyItemTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
