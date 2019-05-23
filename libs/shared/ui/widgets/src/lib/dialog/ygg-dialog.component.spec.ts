import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YggDialogComponent } from './ygg-dialog.component';

describe('YggDialogComponent', () => {
  let component: YggDialogComponent;
  let fixture: ComponentFixture<YggDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YggDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YggDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
