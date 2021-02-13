import { TestBed } from '@angular/core/testing';

import { BoxAgentService } from './box-agent.service';

describe('BoxAgentService', () => {
  let service: BoxAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
