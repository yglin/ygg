import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceControlComponent } from './resource-control.component';

describe('ResourceControlComponent', () => {
  let component: ResourceControlComponent;
  let fixture: ComponentFixture<ResourceControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
