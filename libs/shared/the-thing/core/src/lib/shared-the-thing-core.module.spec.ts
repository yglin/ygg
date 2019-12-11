import { async, TestBed } from '@angular/core/testing';
import { SharedTheThingCoreModule } from './shared-the-thing-core.module';

describe('SharedTheThingCoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTheThingCoreModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTheThingCoreModule).toBeDefined();
  });
});
