import { async, TestBed } from '@angular/core/testing';
import { ResourceCoreModule } from './resource-core.module';

describe('ResourceCoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ResourceCoreModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ResourceCoreModule).toBeDefined();
  });
});
