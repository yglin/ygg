import { async, TestBed } from '@angular/core/testing';
import { ResourceDataAccessModule } from './resource-data-access.module';

describe('ResourceDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ResourceDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ResourceDataAccessModule).toBeDefined();
  });
});
