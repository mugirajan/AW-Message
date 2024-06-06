import { TestBed } from '@angular/core/testing';

import { FilterContactService } from './filter-contact.service';

describe('FilterContactService', () => {
  let service: FilterContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
