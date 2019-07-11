import { async, TestBed } from '@angular/core/testing';
import { SharedInfraDataAccessModule } from './shared-infra-data-access.module';

describe('SharedInfraDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedInfraDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedInfraDataAccessModule).toBeDefined();
  });
});
