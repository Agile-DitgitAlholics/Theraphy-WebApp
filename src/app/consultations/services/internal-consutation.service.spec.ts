import { TestBed } from '@angular/core/testing';

import { InternalConsultationService } from './internal-consutation.service';

describe('SharedConsutationService', () => {
  let service: InternalConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalConsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
