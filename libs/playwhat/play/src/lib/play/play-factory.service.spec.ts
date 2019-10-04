import { TestBed } from '@angular/core/testing';

import { PlayFactoryService } from './play-factory.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PlayFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule]
  }));

  it('should be created', () => {
    const service: PlayFactoryService = TestBed.get(PlayFactoryService);
    expect(service).toBeTruthy();
  });
});
