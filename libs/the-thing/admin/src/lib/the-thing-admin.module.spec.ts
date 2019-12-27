import { async, TestBed } from '@angular/core/testing';
import { TheThingAdminModule } from './the-thing-admin.module';

describe('TheThingAdminModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TheThingAdminModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TheThingAdminModule).toBeDefined();
  });
});
