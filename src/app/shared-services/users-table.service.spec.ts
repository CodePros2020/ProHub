import { TestBed } from '@angular/core/testing';

import { UsersTableService } from './users-table.service';

describe('UsersTableService', () => {
  let service: UsersTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
