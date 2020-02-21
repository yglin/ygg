import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImitationViewDogComponent } from './imitation-view-dog.component';

describe('ImitationViewDogComponent', () => {
  let component: ImitationViewDogComponent;
  let fixture: ComponentFixture<ImitationViewDogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImitationViewDogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImitationViewDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
