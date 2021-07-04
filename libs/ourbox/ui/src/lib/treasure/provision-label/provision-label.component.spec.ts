import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionLabelComponent } from './provision-label.component';

describe('ProvisionLabelComponent', () => {
  let component: ProvisionLabelComponent;
  let fixture: ComponentFixture<ProvisionLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
