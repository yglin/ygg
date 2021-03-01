import { TestBed } from '@angular/core/testing';

import { GeographyAgentService } from './geography-agent.service';

describe('GeographyAgentService', () => {
  let service: GeographyAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeographyAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
