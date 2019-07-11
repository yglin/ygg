import { async, TestBed } from '@angular/core/testing';
import { SharedInfraLogModule } from './shared-infra-log.module';

describe('SharedInfraLogModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedInfraLogModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedInfraLogModule).toBeDefined();
  });
});
