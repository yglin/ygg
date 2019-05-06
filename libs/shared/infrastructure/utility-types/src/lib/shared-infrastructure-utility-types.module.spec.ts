import { async, TestBed } from '@angular/core/testing';
import { SharedInfrastructureUtilityTypesModule } from './shared-infrastructure-utility-types.module';

describe('SharedInfrastructureUtilityTypesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedInfrastructureUtilityTypesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedInfrastructureUtilityTypesModule).toBeDefined();
  });
});
