import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyThingsComponent } from './my-things.component';

describe('MyThingsComponent', () => {
  let component: MyThingsComponent;
  let fixture: ComponentFixture<MyThingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyThingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
